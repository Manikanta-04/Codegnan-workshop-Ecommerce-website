const express = require("express")
const router = express.Router()

const Cart = require("../models/Cart")   // ✅ FIX 1 (IMPORTANT)
const Product = require("../models/Product")
const { protect } = require("../middleware/authMiddleware")

// ✅ ADD TO CART
router.post("/add", protect, async (req, res) => {
    try {
        const { productId } = req.body

        const product = await Product.findById(productId)

        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }

       let cart = await Cart.findOne({ userId: req.user.id })

if (!cart) {
    cart = new Cart({
        userId: req.user.id,
        items: []   // ✅ FIXED
    })
}

const itemIndex = cart.items.findIndex(
    item => item.productId.toString() === productId
)

if (itemIndex > -1) {
    cart.items[itemIndex].quantity += 1
} else {
    cart.items.push({
        productId,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
    })
}

        await cart.save()

        res.status(201).json({ message: "Added to cart" })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Error adding to cart" })
    }
})


// ✅ GET CART (FIXED VERSION)
router.get("/", protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(200).json({ items: [] });
    }

    res.status(200).json(cart); // ✅ THIS LINE WAS MISSING

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching cart" });
  }
});

module.exports = router