export const servicePages = [
  {
    slug: "amplifier-engineering",
    title: "Amplifier Engineering",
    shortTitle: "Amplifier Engineering",
    eyebrow: "Power with control",
    summary:
      "A well-matched amplifier chain gives a sound system the headroom, stability and control it needs to perform reliably.",
    description:
      "AudioTechServices helps plan, integrate and commission amplifier systems around the speakers, venue and way a system will be used.",
    icon: "amplifier",
    focus: "Build a dependable signal-to-power chain",
    details: [
      "Review speaker loads, system goals and the existing audio chain before specifying amplification.",
      "Plan channel allocation, gain structure, signal routing and rack integration for a clear, serviceable setup.",
      "Commission and check the installation so operators can use the system with confidence.",
    ],
    outcomes: [
      "Amplifier and loudspeaker matching",
      "Rack, wiring and signal-flow planning",
      "System commissioning and diagnostics",
    ],
    applications: ["Auditoriums", "Performance venues", "Cinema rooms", "Commercial audio"],
  },
  {
    slug: "dsp-processing-solutions",
    title: "DSP Processing Solutions",
    shortTitle: "DSP Processing Solutions",
    eyebrow: "Shape every signal",
    summary:
      "Digital signal processing brings routing, loudspeaker management and room-specific tuning into one considered system design.",
    description:
      "We configure and integrate DSP around your audio sources, loudspeakers and operating needs, then tune the system for its space.",
    icon: "dsp",
    focus: "Make the signal path clear and manageable",
    details: [
      "Map inputs, outputs and zones into an understandable signal flow for the venue.",
      "Configure loudspeaker management, crossover, equalisation, delay and system protection as required by the design.",
      "Tune the installed system and document the configuration for day-to-day operation and future service.",
    ],
    outcomes: [
      "DSP setup and audio routing",
      "Loudspeaker processing and room tuning",
      "Configuration review and troubleshooting",
    ],
    applications: ["Multi-zone venues", "Auditoriums", "Cinema rooms", "Installed sound"],
  },
  {
    slug: "cinema-sound-systems",
    title: "Cinema Sound Systems",
    shortTitle: "Cinema Sound Systems",
    eyebrow: "A considered cinema experience",
    summary:
      "Bring dialogue, effects and music together with a cinema audio system planned around the room and its audience.",
    description:
      "From speaker layout and amplification to processing and final tuning, we coordinate the audio components as one integrated system.",
    icon: "cinema",
    focus: "Design the room around clear, balanced sound",
    details: [
      "Plan screen-channel, surround and subwoofer positions around the room layout and listening area.",
      "Integrate speakers, amplification and processing into a coherent, maintainable system.",
      "Commission and fine-tune the installation, or assess an existing room for an upgrade.",
    ],
    outcomes: [
      "Cinema speaker and subwoofer integration",
      "Amplifier and DSP system coordination",
      "Installation, commissioning and upgrades",
    ],
    applications: ["Private screening rooms", "Cinema spaces", "Home theatres", "Media rooms"],
  },
  {
    slug: "professional-audio-integration",
    title: "Professional Audio Integration",
    shortTitle: "Professional Audio Integration",
    eyebrow: "One system, working together",
    summary:
      "Connect audio sources, processing, amplification and loudspeakers into a complete system that is practical to operate.",
    description:
      "We coordinate the design and installation details so professional audio components work together across your venue.",
    icon: "integration",
    focus: "Turn individual components into a complete system",
    details: [
      "Understand the room, users and operational requirements before planning the system architecture.",
      "Coordinate audio sources, DSP, amplification, loudspeakers, cabling and control requirements.",
      "Install, commission and hand over a clear system with practical operating guidance.",
    ],
    outcomes: [
      "End-to-end audio system planning",
      "Equipment, cabling and control integration",
      "Commissioning and operator handover",
    ],
    applications: ["Auditoriums", "Corporate spaces", "Houses of worship", "Commercial venues"],
  },
];

export function getServicePage(slug) {
  return servicePages.find((service) => service.slug === slug);
}
