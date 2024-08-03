import styles from "@/styles/p-user/answerTicket.module.css";
import Link from "next/link";
import Answer from "@/components/templates/p-user/tickets/Answer";
import connectToDB from "@/configs/db";
import TicketModel from "@/models/Ticket";
import Layout from "@/components/layouts/userPanelLayout";

const page = async ({ params }) => {
  const ticketID = params.id;
  connectToDB();

  const ticket = await TicketModel.findOne({ _id: ticketID })
    .populate("user", "name img")
    .lean();

  const answerTicket = await TicketModel.findOne({
    mainTicket: ticket._id,
  }).populate("user", "name img");

  return (
    <Layout>
      <main className={styles.container}>
        <h1 className={styles.title}>
          <span>تیکت</span>
          <Link href="/p-user/tickets/send-ticket">ارسال تیکت جدید</Link>
        </h1>

        <div>
          <Answer type="user" {...ticket} />
          {answerTicket && (
            <Answer {...ticket} answer={answerTicket.body} type="admin" />
          )}

          {!answerTicket && (
            <div className={styles.empty}>
              <p>هنوز پاسخی دریافت نکردید</p>
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
};

export default page;

export async function generateMetadata({ params }) {
  const ticket = await TicketModel.findOne({ _id: params.id }, "title");
  return {
    title: ` تیکت | ${ticket.title} `,
  };
}
