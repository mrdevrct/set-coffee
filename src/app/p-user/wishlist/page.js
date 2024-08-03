import styles from "@/styles/p-user/wishlist.module.css";
import Product from "@/components/templates/p-user/wishlist/Product"; // Ensure this import is correct
import connectToDB from "@/configs/db";
import WishlistModel from "@/models/Wishlist";
import Layout from "@/components/layouts/userPanelLayout";
import { authUser } from "@/utils/isLogin";

const page = async () => {
  await connectToDB();
  const user = await authUser();
  const wishlist = await WishlistModel.find({ user: user._id })
    .populate("product")
    .lean();

  return (
    <Layout>
      <main>
        <h1 className={styles.title}>
          <span>علاقه مندی ها</span>
        </h1>
        <div className={styles.container}>
          {wishlist.length > 0 &&
            wishlist.map((wish) => (
              <Product
                key={wish._id}
                productID={String(wish.product._id)}
                name={wish.product.name}
                price={wish.product.price}
                score={wish.product.score}
                productImage={wish.product.img}
              />
            ))}
        </div>

        {wishlist.length === 0 && (
          <p className={styles.empty}>محصولی وجود ندارد</p>
        )}
      </main>
    </Layout>
  );
};

export default page;


export const metadata = {
  title: " علاقه مندی ها |  پنل کاربری",
}