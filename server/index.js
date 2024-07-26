const express = require("express");
const {
  client,
  createTables,
  createUser,
  createProduct,
  createFavorite,
  fetchFavorites,
  destroyFavorite,
  fetchUsers,
  fetchProducts,
} = require("./db");

const server = express();

server.use(express.json());

server.get("/api/users", async (req, res, next) => {
  try {
    res.send(await fetchUsers());
  } catch (error) {
    next(error);
  }
});
server.get("/api/products", async (req, res, next) => {
  try {
    res.send(await fetchProducts());
  } catch (error) {
    next(error);
  }
});
server.get("/api/users/:id/favorites", async (req, res, next) => {
  try {
    res.send(await fetchFavorites({ user_id: req.params.id }));
  } catch (error) {
    next(error);
  }
});
server.post("/api/users/:id/favorites", async (req, res, next) => {
  try {
    res.status(201).send(
      await createFavorite({
        user_id: req.params.id,
        product_id: req.params.product_id,
      })
    );
  } catch (error) {
    next(error);
  }
});
server.delete("/api/users/:userId/favorites/:id", async (req, res, next) => {
  try {
    await destroyFavorite({ id: req.params.id, user_id: req.params.userId });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

server.use((err, req, res, next) => {
  res.status(err.status || 500).send({ error: err.message || err });
});

const init = async () => {
  await client.connect();
  await createTables();
  console.log("Created tables!");

  const [user1, user2, user3, user4] = await Promise.all([
    createUser({ username: "CoconutKamala", password: "thisisapassword" }),
    createUser({
      username: "PrismaticWizard",
      password: "thisisalsoapassword",
    }),
    createUser({
      username: "YeetusDonJesus",
      password: "ohlookanotherpassword",
    }),
    createUser({
      username: "TheCheetoMan",
      password: "ohwowitsyetanotherpassword",
    }),
  ]);
  console.log("Users seeded!");

  const [
    prod1,
    prod2,
    prod3,
    prod4,
    prod5,
    prod6,
    prod7,
    prod8,
    prod9,
    prod10,
  ] = await Promise.all([
    createProduct({ name: "Jellybeans" }),
    createProduct({ name: "Bongos" }),
    createProduct({ name: "Catnip" }),
    createProduct({ name: "Headphones" }),
    createProduct({ name: "Scooby Snax" }),
    createProduct({ name: "Pencils" }),
    createProduct({ name: "Gothic Cat Tree" }),
    createProduct({ name: "Painting of a Bird" }),
    createProduct({ name: "One Meatball" }),
    createProduct({ name: "Cat Treats" }),
  ]);
  console.log("Products seeded!");

  await Promise.all([
    createFavorite({ user_id: user1.id, product_id: prod2.id }),
    createFavorite({ user_id: user2.id, product_id: prod3.id }),
    createFavorite({ user_id: user3.id, product_id: prod5.id }),
    createFavorite({ user_id: user4.id, product_id: prod9.id }),
  ]);
  console.log("Favorites seeded!");

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}`);
  });
};

init();
