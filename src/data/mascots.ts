export interface Mascot {
  id: string;
  name: string;
  image: string;
  tags: string[];
  description: string;
}

export const mascotas: Mascot[] = [
  {
    id: 'sol',
    name: 'Sol',
    image: '/Elementos/Sol.svg',
    tags: ['Energía Suave', 'Cálido'],
    description: 'Sol es pura energía suave. Siempre está de buen humor, le gusta animar a los demás y ver el lado bonito de todo. No es intenso, es más bien cálido y tranquilito.'
  },
  {
    id: 'luna',
    name: 'Luna',
    image: '/Elementos/Luna.svg',
    tags: ['Serena', 'Misteriosa'],
    description: 'Luna es serena y un poquito misteriosa. Le gusta observar en silencio, cuidar los sueños de los demás y aparecer justo cuando todo se calma. Tiene una energía suave e introspectiva, como esos momentos tranquilos en la noche donde todo se siente más claro y profundo.'
  },
  {
    id: 'nube',
    name: 'Nube',
    image: '/Elementos/Nube.svg',
    tags: ['Relajada', 'Soñadora'],
    description: 'Nube es relajada y soñadora. Le encanta flotar sin prisa, imaginar historias y acompañar en silencio. Es ese tipo de personaje que escucha mucho y transmite calma, como un respiro profundo en medio del caos.'
  },
  {
    id: 'estrella',
    name: 'Estrella',
    image: '/iconos/Estrella_1.svg',
    tags: ['Brillante', 'Guía'],
    description: 'Estrella es una guía brillante que te ayuda a iluminar tus objetivos. Siempre está ahí para mostrarte el camino cuando te sientes perdido.'
  }
];
