//mock data
const products = [
  {
    id: 1,
    name: "Lampa podłogowa",
    photoUrl:
      "https://www.momastudio.pl/produkty/LAMPAPODLOGOWAREVOLVECZARNA5.jpg",
    pages: [
      {
        url: "https://www.momastudio.pl/oswietlenie/lampy-podlogowe/lampa-podlogowa-revolve-czarna-bolia",
        priceElemId: "cenaproduktuok",
      },
      {
        url: "https://pufadesign.pl/lampy-podlogowe/10156-lampa-podlogowa-revolve-bolia-czarna-5702410228054.html",
        priceElemId: "our_price_display",
      },
    ],
  },
];

const productsRepository = {
  getAllProducts: () => products,
};

module.exports.productsRepository = productsRepository;
