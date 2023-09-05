import { Resolvers, Thing } from "../__generated__/resolvers-types";
const defaultThing: Thing = {
  id: "1",
  name: "Name",
  size: "Huge",
  hasHair: true,
  teeth: 32,
  dreams: ["Dream 1", "Dream 2"],
  hopes: ["Hope 1", "Hope 2"],
};
export const Mutation: Resolvers = {
  Mutation: {
    createThing(_parent, { thing }, _context) {
      return {...defaultThing, ...thing as Thing };
    },
  },
};
