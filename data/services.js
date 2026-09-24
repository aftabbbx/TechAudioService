import { Headphones, Settings, Wrench, ShieldCheck } from "lucide-react";

export const services = [
  {
    id: "consultation",
    icon: Headphones,
    title: "System Consultation",
    description:
      "Expert analysis of your audio requirements, venue acoustics, and performance objectives to define the optimal system architecture.",
    details: [
      "Venue acoustic analysis",
      "System requirement mapping",
      "Budget optimization",
      "Technology recommendation",
    ],
  },
  {
    id: "engineering",
    icon: Settings,
    title: "Design & Engineering",
    description:
      "Precision system design including speaker placement, amplifier sizing, DSP configuration, and signal flow architecture.",
    details: [
      "CAD-based speaker placement",
      "Amplifier & DSP specification",
      "Signal flow design",
      "Wiring and infrastructure planning",
    ],
  },
  {
    id: "installation",
    icon: Wrench,
    title: "Installation",
    description:
      "Professional installation, commissioning, and tuning by certified audio engineers ensuring optimal real-world performance.",
    details: [
      "Professional rigging & mounting",
      "System wiring & termination",
      "DSP tuning & alignment",
      "Final commissioning & handover",
    ],
  },
  {
    id: "support",
    icon: ShieldCheck,
    title: "Support & AMC",
    description:
      "Ongoing maintenance, annual contracts, and responsive technical support to ensure long-term system reliability.",
    details: [
      "24/7 technical support",
      "Preventive maintenance visits",
      "Firmware & software updates",
      "Emergency response service",
    ],
  },
];
