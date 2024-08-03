import Footer from "@/components/modules/footer/Footer";
import Navbar from "@/components/modules/navbar/Navbar";
import Breadcrumb from "@/components/modules/breadcrumb/Breadcrumb";
import styles from "@/styles/about-us.module.css";
import { authAdmin, authUser } from "@/utils/isLogin";
import ArticleModel from "@/models/Article";
import ProductModel from "@/models/Product";

const page = async () => {
  const user = await authUser();
  const isAdmin = await authAdmin();
  let userID = null;
  if (user) {
    userID = user._id.toString() || null;
  }
  const articles = await ArticleModel.find({}).sort({ _id: -1 }).limit(2);
  const products = await ProductModel.find({}).lean();

  return (
    <>
      <Navbar
        isLogin={user ? true : false}
        userID={userID ? userID : null}
        isAdmin={isAdmin ? true : false}
        products={JSON.parse(JSON.stringify(products))}
      />

      <Breadcrumb route={"درباره ما"} />
      <div className={styles.container}>
        <section>
          <div>
            <span>درباره ما</span>
            <p>فنجان داغ خوارزمی قهوه ست</p>
          </div>
          <p>
            تجربه‌ای به قدمت چهار نسل و ارتباط مستمر با مصرف کنندگان ضامن این
            ویژگی‌هاست. از ویژگی‌های بارز مجموعه قهوه ست واردات مواد اولیه راسا
            به وسیله مدیریت مجموعه و انتخاب بهترین مواد اولیه جهت تولید قهوه
            است.
          </p>
          <p>
            مجموعه قهوه ست اولین مجموعه مرتبط با قهوه در ایران است که در سال
            2007 به عضویت انجمن تخصصی قهوه اروپا (Speciality coffee association
            of Europe) در آمده است.
          </p>
        </section>
        <main className={styles.main}>
          <div>
            <p className={styles.description}>
              مسیری را که بنیان‌گذاران «قهوه ست» در دهه 20 شمسی آغاز کرده‌اند
              اکنون وارد مرحله جدیدی شده است و مفتخریم اعلام کنیم در بهمن ماه 94
              موفق به اخذ مجوزهای مربوطه از وزارت بهداشت درمان و آموزش پزشکی و
              سازمان غذا دارو شده‌ایم و تولید سنتی و محدود قهوه را تبدیل به
              تولید صنعتی و انبوه کرده‌ایم.
            </p>
            <p className={styles.description}>
              از دیگر افتخارات مجموعه «قهوه ست» اخذ مدرک دیپلم دانش قهوه از
              انجمن قهوه تخصصی اروپا در فروردین ماه سال 95 است. (SCAE Coffee
              Diploma)
            </p>
            <p className={styles.description}>
              امید داریم با کسب دانش روز دنیا در این صنعت ارتقا کیفیت و تنوع
              محصول در حد استانداردهای جهانی را در آینده‌ای نزدیک شاهد باشیم.
            </p>
            <p>صاحب امتیاز: شرکت فنجان داغ خوارزمی</p>
          </div>
          <div>
            <span>Set Coffee</span>
            <p className={styles.title}>داستان قهوه ست</p>
            <p className={styles.description}>
              تجربه‌ای به قدمت چهار نسل و ارتباط مستمر با مصرف کنندگان ضامن این
              ویژگی‌هاست. از ویژگی‌های بارز مجموعه قهوه ست واردات مواد اولیه
              راسا به وسیله مدیریت مجموعه و انتخاب بهترین مواد اولیه جهت تولید
              قهوه است.
            </p>
            <p className={styles.description}>
              مجموعه قهوه ست اولین مجموعه مرتبط با قهوه در ایران است که در سال
              2007 به عضویت انجمن تخصصی قهوه اروپا (Speciality coffee
              association of Europe) در آمده است و بسیاری از دوره‌های مربوط به
              فرآوری قهوه را مدیریت این مجموعه به صورت تخصصی در کارگاه‌های
              آموزشی این انجمن و همچنین کارگاه‌های تخصصی فرآوری قهوه به خصوص در
              زمینه بو دادن قهوه(Roasting) را در کشور آمریکا که از پیشگامان این
              صنعت است را گذرانده است. اکنون با پشتوانه دستاوردهای گذشته و
              تکنولوژی روز دنیا وارد مرحله تولید قهوه به صورت صنعتی و گسترده
              شده‌ایم و مفتخریم اعلام کنیم که «قهوه ست» از این پس یک نام تجاری
              صنعتی در صنعت قهوه ایران است
            </p>
          </div>
        </main>
      </div>

      <Footer
        articles={JSON.parse(JSON.stringify(articles))}
        isLogin={user ? true : false}
      />
    </>
  );
};

export default page;

export const metadata = {
  title: "درباره ما  | فروشگاه اینترنتی قهوه ست",
};
