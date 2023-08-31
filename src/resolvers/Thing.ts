import { Resolvers } from "../__generated__/resolvers-types";

export const Thing: Resolvers = {
  Thing: {
    __resolveReference(parent, _context) {
      return {
        id: parent.id,
        name: "Name",
        size: "Huge",
        hasHair: true,
        teeth: 32,
        dreams: ["Dream 1", "Dream 2"],
        hopes: ["Hope 1", "Hope 2"],
      };
    },
  },
};
