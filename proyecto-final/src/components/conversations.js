export const conversationStarters = [
  {
    id: 1,
    texto: "¿Quieres ir al parque?",
  },
  {
    id: 4,
    texto: "¿Te gustaría ver una película?",
  },
  {
    id: 5,
    texto: "Hace un día estupendo, ¿quieres ir a la playa?",
  },
];

export const conversationOptions = [
  {
    id: 1,
    texto: "¿Quieres ir al parque?",
    opciones: [
      { texto: "Sí, vamos.", siguienteId: 2 },
      { texto: "No, prefiero quedarme en casa.", siguienteId: 3 },
    ],
  },
  {
    id: 2,
    texto: "¡Genial! ¿Qué te gustaría hacer en el parque?",
    opciones: [
      { texto: "Jugar al fútbol.", siguienteId: 6 },
      { texto: "Dar un paseo.", siguienteId: 7 },
    ],
  },
  {
    id: 3,
    texto: "No hay problema, mañana nos vemos",
    final: true,
  },
  {
    id: 4,
    texto: "¿Te gustaría ver una película?",
    opciones: [
      { texto: "Sí, me encantaría.", siguienteId: 8 },
      { texto: "No, prefiero ver una serie.", siguienteId: 9 },
    ],
  },
  {
    id: 5,
    texto: "Hace un día estupendo, ¿quieres ir a la playa?",
    opciones: [
      { texto: "Sí, ¡vamos a la playa!", siguienteId: 10 },
      { texto: "No, mejor vamos a la piscina.", siguienteId: 11 },
    ],
  },
  {
    id: 6,
    texto: "¡Diviértete jugando al fútbol!",
    final: true,
  },
  {
    id: 7,
    texto: "¡Disfruta de tu paseo!",
    final: true,
  },
  {
    id: 8,
    texto: "Vamos a ver la película, ¡disfrútala!",
    final: true,
  },
  {
    id: 9,
    texto: "¡Que disfrutes de la serie!",
    final: true,
  },
  {
    id: 10,
    texto: "¡Que te diviertas en la playa!",
    final: true,
  },
  {
    id: 11,
    texto: "¡Disfruta de la piscina!",
    final: true,
  },
];
