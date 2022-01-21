CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE DATABASE ecommerce
CREATE TABLE users (
user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
user_name VARCHAR(255) NOT NULL,
user_email VARCHAR(255) NOT NULL UNIQUE CONSTRAINT valid_email CHECK (user_email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'),
user_password VARCHAR(255) NOT NULL);
user_password VARCHAR(255) NOT NULL CONSTRAINT valid_password CHECK(user_password LIKE '%[^a-z0-9]%' AND LENGTH(user_password)>=6));


CREATE TABLE products (
product_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
product_name VARCHAR(255) NOT NULL UNIQUE,
product_description TEXT NOT NULL,
product_price NUMERIC NOT NULL CONSTRAINT price_positive CHECK(product_price >0));

CREATE TABLE cart(
    cart_id BIGSERIAL PRIMARY KEY,
    cart_product uuid NOT NULL,
    cart_user uuid NOT NULL,
    quantity INT NOT NULL CONSTRAINT quantity_not_null CHECK(quantity>=1),
    CONSTRAINT cart_user FOREIGN KEY(cart_user) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT cart_product FOREIGN KEY(cart_product) REFERENCES products(product_id) ON DELETE CASCADE);

INSERT INTO products(product_name, product_description, product_price) VALUES ('Rice - 7 Grain Blend', 'Rice with a brown hue. Barley. Millet. Flax seed is a type of seed. Wheat. Quinoa in a red color. Rice from the wild. Microwave for 90 seconds in the pouch. USDA certified organic. 100% Whole Grain: 44 g or more per serving Consume 48 g or more of whole grains per day. You''re only 90 seconds away from a nutritious side dish or a meal on its own. It''s that easy!', 12.5),
('Applue Custard', 'Custard apples have delicious mellow flesh that is almost as soft as custard. Custard apples are thought to have originated in South America and the West Indies. These apples are usually heart or oval in shape and can weigh up to 450g. They have quilted skin that is light tan or greenish in color and turns brown as the fruit ripens.', 9.99),
('Saskatoon Berries - Frozen', 'Raw plant-based superfood jam-packed with nutrients to get you through the day! We can keep all of the benefits and flavors of fresh Saskatoon Berries by freeze drying them, making them an easy on-the-go treat! They''re great as a healthy snack or added to cereals, smoothies, salads, and baking. A healthy diet high in vegetables and fruits may lower the risk of certain types of cancer.', 25.24),
('Puree Raspberry', 'Make the perfect summer sorbet to cool off in style! This 100% natural frozen puree is made of 90% fruit and 10% sugar, with no artificial flavors, colorings, or preservatives: simple, fresh, and delicious! Make sorbets, smoothies, ice creams, jellies and jams, sauces, and pastry fillings with this raspberry puree.', 19.9),
('Paté Cognac', 'Pâté made with pork liver and meat that has been infused with cognac. The spirits complement the pâté''s rich, smooth flavor, which is sure to appeal to foodies.', 24.24),
('Pita Bread', 'A versatile flat bread that is soft and slightly chewy on the inside and often has a pocket inside as a result of baking the bread in a hot oven. Pita bread is frequently mistakenly thought to be unleavened, but it is usually leavened with yeast. The bread can be eaten plain or with a drizzle of olive oil.', 24.99),
('Beef Consomme', 'A sauce or soup base made from clarified meat stock (usually beef, veal, or poultry, but also fish) into a clear and flavorful liquid broth. Egg whites are used to clarify the meat stock as well as any additional ingredients such as vegetables and/or herbs. While the mixture is being brought to a boil, it is being stirred. The boiled solution is no longer stirred as the egg whites solidify on top of the mixture, allowing the fats and impurities to be absorbed or attached to the white.', 12.96),
('Sausage Chorizo', 'Chorizo is a highly seasoned chopped or ground pork sausage that is commonly found in Spanish and Mexican cuisine. Mexican chorizo is made from fresh (raw, uncooked) pork, whereas Spanish chorizo is typically smoked.', 9.99),
('Bacardi Breezer','The Bacardi Breezer is an excellent way to enjoy the worlds'' most popular rum – Bacardi. Bacardi Breezer Cranberry is a refreshing drink made from Bacardi rum, real cranberry juice, and carbonated water.', 5),
('Mince Meat Filling', 'Mincemeat is a combination of chopped dried fruit, distilled spirits, and spices, as well as occasionally beef suet, beef, or venison. Usually used as filling for mince pies during Christmas, but it tastes great mixed with vanilla ice cream, as well', 2.99),
('English Muffins', 'A small, round, yeast-leavened sourdough bread that is commonly sliced horizontally, toasted, and buttered. In North America and Australia, it is commonly eaten for breakfast, often with sweet or savory toppings such as fruit jam or honey, or eggs, sausage, bacon, or cheese.', 2.55),
('Triple Sec - McGuiness', 'When mixed with your favorite cocktail, McGuinness Triple Sec becomes three times more delicious. The drink''s name means "dry" in French, and "trîple" implies three times as dry, so it''s no surprise that people fall in love with this whisky flavor.', 7.50),
('Sage Ground', 'Sage is an excellent herb for seasoning fatty meats like pork, lamb, mutton, and game (goose or duck). It also complements onions, eggplant, tomatoes, and potatoes. Sage is frequently used in stuffings and cheeses.', 5.56),
('Swiss Cheese', 'Swiss cheese is a mild cow''s milk cheese with a firmer texture than baby Swiss. The flavor is light, sweet, and nutty. Swiss cheese is distinguished by its luster, pale yellow color, and large holes (called eyes) caused by carbon dioxide released during the maturation process.', 5.55),
('Lamb Shoulder (Boneless)', 'Great for roasts, stews or any lamb recipe that has a marinade or a long slow cooking time and temperature.',2.99),
('Pears', 'Pears are rich in essential antioxidants, plant compounds, and dietary fiber. They pack all of these nutrients in a fat free, cholesterol free, 100 calorie package.', 6.50),
('Ice Cream Dark Super Cone', 'Natural flavors, colors, and fragrances Contains no peanuts or nuts. 4 cones of French Vanilla ice cream and 4 cones of Dark Chocolate ice cream with a thick dark chocolate core These Super Cones are made with 100% Canadian dairy and are wrapped in dark chocolate sugar cones with a chocolate topping. A fantastic flavor offering in a great family package. Delectables for a single serving Produced in a peanut and nut-free environment.', 10.99),
('Black Currant Jelly', 'The natural flavor of the fruit is preserved by gently cooking in the French countryside tradition. Sweetened only with vineyard ripened grape and fruit juices, 100 percent from fruit Authentic French Recipe, Gently cooked to preserve the natural flavor of the fruit, Gluten-Free, Only Natural Sugars, Non-Genetically Modified Ingredients, No Cane Sugars, Corn Syrups, Artificial Sweeteners, Colors, Flavors, or Preservatives, All Natural Ingredients', 7.50);
