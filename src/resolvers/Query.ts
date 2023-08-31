import { Resolvers } from "../__generated__/resolvers-types";

export const Query: Resolvers = {
  Query: {
    thing(_parent, { id }, _context) {
      return {
        id: id.toString(),
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
