import Footer from "@/components/modules/footer/Footer";
import Navbar from "@/components/modules/navbar/Navbar";
import Articles from "@/components/templates/index/articles/Articles";
import Banner from "@/components/templates/index/banner/Banner";
import Latest from "@/components/templates/index/latest/Latest";
import Promote from "@/components/templates/index/promote/Promote";
import React from "react";
import { authAdmin, authUser } from "@/utils/isLogin";
import ProductModel from "@/models/Product";
import ArticleModel from "@/models/Article";
import WishListModel from "@/models/Wishlist";
import connectToDB from "@/configs/db";

async function Home() {
  connectToDB();
  const user = await authUser();
  const isAdmin = await authAdmin();
  let userID = user ? String(user._id) : null;
  let wishs = [];

  const lastProduct = await ProductModel.find({}).sort({ _id: -1 }).limit(8);
  const lastArticle = await ArticleModel.find({}).sort({ _id: -1 }).limit(8);
  const articles = await ArticleModel.find({}).sort({ _id: -1 }).limit(2);
  const products = await ProductModel.find({}).lean();
  
  if (user) {
    wishs = await WishListModel.find({ user: user._id });
  }


  return (
    <>
      <Navbar
        isLogin={user ? true : false}
        userID={userID ? userID : null}
        isAdmin={isAdmin ? true : false}
        products={JSON.parse(JSON.stringify(products))}
      />
      <Banner />
      <Latest
        products={JSON.parse(JSON.stringify(lastProduct))}
        wishs={JSON.parse(JSON.stringify(wishs))}
      />
      <Promote />
      <Articles articles={JSON.parse(JSON.stringify(lastArticle))} />
      <Footer articles={JSON.parse(JSON.stringify(articles))} isLogin={user ? true : false}/>
    </>
  );
}

export default Home;
