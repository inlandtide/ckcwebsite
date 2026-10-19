type TeamMember = {
  name: string;
  role: string;
};

export const teamGroups: Array<{ title: string; members: TeamMember[] }> = [
  {
    title: "Leadership",
    members: [
      { name: "Nancy Blaha", role: "President" },
      { name: "Tim Hebel", role: "CFO" },
      { name: "Ryan Hall", role: "CRO" },
      { name: "Dan Stampfl", role: "Plant Manager" },
      { name: "Jason Pennington", role: "Sr. CNC Programmer" },
    ],
  },
  {
    title: "Project management",
    members: [
      { name: "John Ruengert", role: "Sr. Project Manager" },
      { name: "Josh Lanfersieck", role: "Project Manager" },
    ],
  },
  {
    title: "Estimating & production",
    members: [
      { name: "JB Higginbotham", role: "Lead Estimator" },
      { name: "Tyler Hampton", role: "Estimator" },
    ],
  },
];
