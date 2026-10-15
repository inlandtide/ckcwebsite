import ErrorBoundary from "./components/ErrorBoundary";
import Seo from "./components/Seo";
import Analytics from "./components/Analytics";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Route, Switch } from "wouter";
import {
  AboutPage,
  ArchitecturalMillworkPage,
  CabinetryCaseworkPage,
  CareersPage,
  CncMachiningPage,
  ContactPage,
  CommercialFixturesPage,
  CountertopsSpecialtyShapesPage,
  CustomFinishesVeneerPage,
  GalleryPage,
  HomePage,
  NotFoundPage,
  PortfolioPage,
  ShopDrawingsDesignAssistPage,
  ServicesPage,
} from "./pages/Site";

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <Seo />
        <Analytics />
        <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/about" component={AboutPage} />
            <Route path="/careers" component={CareersPage} />
            <Route path="/contact" component={ContactPage} />
            <Route path="/services" component={ServicesPage} />
            <Route path="/services/architectural-millwork" component={ArchitecturalMillworkPage} />
            <Route path="/services/custom-cabinetry-casework" component={CabinetryCaseworkPage} />
            <Route path="/services/commercial-fixtures" component={CommercialFixturesPage} />
            <Route path="/services/cnc-machining" component={CncMachiningPage} />
            <Route path="/services/countertops-specialty-shapes" component={CountertopsSpecialtyShapesPage} />
            <Route path="/services/custom-finishes-veneer" component={CustomFinishesVeneerPage} />
            <Route path="/services/shop-drawings-design-assist" component={ShopDrawingsDesignAssistPage} />
            <Route path="/portfolio" component={PortfolioPage} />
            <Route path="/gallery" component={GalleryPage} />
            <Route component={NotFoundPage} />
          </Switch>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
