const VERIFICATION_TIMEOUT_MS = 8000;

// Let BotID interpret its challenge headers and Vercel request context. The
// adapter only bounds verification time and requires a positive human verdict.
export function createContactVerification({ checkBotId, timeoutMs = VERIFICATION_TIMEOUT_MS, logger = console } = {}) {
  return async function verifyRequest(req, reference) {
    if (typeof checkBotId !== "function") {
      logger.error("CKC verification unavailable", { reference, configured: false });
      return "unavailable";
    }

    let timer;
    try {
      const verification = await Promise.race([
        Promise.resolve().then(() => checkBotId({
          advancedOptions: { checkLevel: "basic", headers: req.headers },
        })),
        new Promise((_, reject) => {
          timer = setTimeout(() => reject(new Error("Verification timed out")), timeoutMs);
        }),
      ]);
      const isHuman = verification?.isHuman === true;
      const isBot = verification?.isBot === true;
      const verified = isHuman && verification?.isBot === false;
      logger.info("CKC verification result", {
        reference, verified, isHuman, isBot,
        isVerifiedBot: verification?.isVerifiedBot === true,
        bypassed: verification?.bypassed === true,
      });
      if (verified) return "human";
      return isBot ? "bot" : "unavailable";
    } catch {
      // Never log SDK exceptions: they can contain tokens or request data.
      logger.error("CKC verification failed or timed out", { reference, verified: false });
      return "unavailable";
    } finally {
      clearTimeout(timer);
    }
  };
}
