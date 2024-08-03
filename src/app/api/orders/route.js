import connectToDB from "@/configs/db";
import AddressModel from "@/models/Address";
import ProductModel from "@/models/Product";
import OrderModel from "@/models/Order";
import OrderItemModel from "@/models/OrderItem";
import { validateEmail, validatePhone } from "@/utils/auth";
import { authUser } from "@/utils/isLogin";

export async function POST(req) {
  try {
    await connectToDB();
    const userID = await authUser();
    const body = await req.json();
    const {
      firstname,
      lastname,
      company,
      province,
      city,
      postal_code,
      email,
      phone,
      address,
      total_price,
      payment_method,
      note,
      product,
    } = body;

    if (!firstname.trim()) {
      return new Response(
        JSON.stringify({ message: "لطفاً نام خود را وارد کنید." }),
        { status: 400 }
      );
    }

    if (!lastname.trim()) {
      return new Response(
        JSON.stringify({ message: "لطفاً نام خانوادگی خود را وارد کنید." }),
        { status: 400 }
      );
    }

    if (!province.trim()) {
      return new Response(
        JSON.stringify({ message: "لطفاً استان خود را وارد کنید." }),
        { status: 400 }
      );
    }

    if (!city.trim()) {
      return new Response(
        JSON.stringify({ message: "لطفاً شهر خود را وارد کنید." }),
        { status: 400 }
      );
    }

    if (!postal_code.trim()) {
      return new Response(
        JSON.stringify({ message: "لطفاً کد پستی خود را وارد کنید." }),
        { status: 400 }
      );
    }

    if (postal_code.length > 10) {
      return new Response(
        JSON.stringify({ message: "کد پستی نمی‌تواند بیشتر از ۱۰ کاراکتر باشد." }),
        { status: 400 }
      );
    }

    if (email) {
      const isValidEmail = validateEmail(email);
      if (!isValidEmail) {
        return new Response(
          JSON.stringify({ message: "لطفاً یک ایمیل معتبر وارد کنید." }),
          { status: 400 }
        );
      }
    }

    if (!phone.trim()) {
      return new Response(
        JSON.stringify({ message: "لطفاً شماره تلفن خود را وارد کنید." }),
        { status: 400 }
      );
    }

    if (phone.length !== 11) {
      return new Response(
        JSON.stringify({ message: "شماره تلفن باید ۱۱ رقم باشد." }),
        { status: 400 }
      );
    }

    const isValidPhone = validatePhone(phone);
    if (!isValidPhone) {
      return new Response(
        JSON.stringify({ message: "لطفاً یک شماره تلفن معتبر وارد کنید." }),
        { status: 400 }
      );
    }

    if (!address.trim()) {
      return new Response(
        JSON.stringify({ message: "لطفاً آدرس خود را وارد کنید." }),
        { status: 400 }
      );
    }

    if (!payment_method.trim()) {
      return new Response(
        JSON.stringify({ message: "لطفاً روش پرداخت را انتخاب کنید." }),
        { status: 400 }
      );
    }

    // بررسی موجودی محصولات و آماده‌سازی آیتم‌های سفارش
    let totalQuantity = 0;
    let finalPrice = 0;
    const orderItems = [];

    for (const item of product) {
      const mainProduct = await ProductModel.findOne({ _id: item.id });
      if (!mainProduct) {
        return new Response(
          JSON.stringify({ message: `محصول با شناسه ${item.id} پیدا نشد.` }),
          { status: 412 }
        );
      }
      if (mainProduct.inventory < item.count) {
        return new Response(
          JSON.stringify({ message: `موجودی محصول ${mainProduct.name} کافی نیست.` }),
          { status: 413 }
        );
      }
      const itemTotalPrice = item.price * item.count;
      totalQuantity += item.count;
      finalPrice += itemTotalPrice;

      // کم کردن موجودی محصول
      mainProduct.inventory -= item.count;
      await mainProduct.save();

      orderItems.push({
        quantity: item.count,
        price: itemTotalPrice,
        product: item.id,
      });
    }

    // ایجاد آدرس جدید
    const newAddress = await AddressModel.create({
      user: userID._id,
      address,
      province,
      city,
      postal_code,
    });

    // ایجاد سفارش جدید
    const order = await OrderModel.create({
      firstname,
      lastname,
      company,
      address: newAddress._id,
      email,
      phone,
      user: userID._id,
      total_price,
      payment_method,
      note,
    });

    // اختصاص شناسه سفارش به آیتم‌های سفارش و ذخیره آن‌ها
    const orderItemData = orderItems.map((item) => ({
      ...item,
      order: order._id,
    }));
    await OrderItemModel.insertMany(orderItemData);

    return new Response(
      JSON.stringify({ orderId: order._id, message: "سفارش با موفقیت ثبت شد." }),
      { status: 201 }
    );
  } catch (e) {
    console.log(e);
    return new Response(
      JSON.stringify({ message: e.message }),
      { status: 500 }
    );
  }
}
