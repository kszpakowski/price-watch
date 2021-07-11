const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const productsRepository = {
  getAllProducts: async () =>
    await prisma.product.findMany({
      include: {
        pages: {},
      },
    }),
  updatePrice: async (pageId, price) => {
    await prisma.page.update({
      where: {
        id: pageId,
      },
      data: {
        lastPrice: price,
      },
    });
  },
};

module.exports.productsRepository = productsRepository;
