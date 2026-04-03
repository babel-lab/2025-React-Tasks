import { useState } from "react";
import { Link } from "react-router-dom";

function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "如何訂購蛋糕？需要提前預訂嗎？",
      answer:
        "建議提前 2～3 天預訂，熱門節日（如生日、母親節）則建議更早下單。你可以在網站選擇商品後加入購物車，填寫訂購資訊並完成付款即可。",
    },
    {
      question: "蛋糕可以指定取貨時間或配送時間嗎？",
      answer:
        "可以的！結帳時可選擇希望的取貨或配送時段，我們會依照你的時間安排製作與出貨，確保蛋糕新鮮送達。",
    },
    {
      question: "蛋糕是當天現做的嗎？",
      answer:
        "我們的蛋糕皆為接單後新鮮製作，部分商品會於取貨當天完成製作，確保口感與品質。",
    },
    {
      question: "可以客製化蛋糕內容或寫字嗎？",
      answer:
        "大部分蛋糕都可以提供簡單客製（如祝福文字、插牌），你可以在訂單備註中填寫需求，或聯絡我們確認細節。",
    },
    {
      question: "配送方式有哪些？可以冷藏配送嗎？",
      answer:
        "我們提供門市自取與冷藏宅配服務。宅配會使用專業冷藏物流，確保蛋糕在運送過程中維持品質。",
    },
    {
      question: "蛋糕可以保存多久？如何保存？",
      answer:
        "建議冷藏保存並於 2 天內食用完畢。食用前可稍微回溫，口感會更佳。",
    },
    {
      question: "臨時取消或修改訂單可以嗎？",
      answer:
        "若尚未進入製作流程，可協助修改或取消；若已開始製作，則可能無法更改，建議儘早聯繫我們。",
    },
    {
      question: "有提供發票或收據嗎？",
      answer:
        "我們會提供電子發票，如需統編或公司抬頭，請在結帳時填寫相關資訊。",
    },
  ];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="bg-light">
      {/* Hero */}
      <section className="py-5 bg-white border-bottom">
        <div className="container">
          <div
            className="d-flex flex-column justify-content-center align-items-center text-center mx-auto"
            style={{ maxWidth: "760px", minHeight: "280px" }}
          >
            <p className="fw-bold mb-2 text-dark">FAQ</p>
            <h1 className="fw-bold mb-3">常見問題</h1>
            <p className="text-secondary lh-lg mb-4">
              整理了網站常見操作與商品相關問題，讓你在瀏覽與購買甜點時更方便理解整體流程。
            </p>
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <Link to="/product" className="btn btn-dark px-4 py-2">
                前往產品列表
              </Link>
              <Link to="/about" className="btn btn-outline-dark px-4 py-2">
                了解我們
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ main */}
      <section className="py-5">
        <div className="container">
          <div
            className="d-flex flex-column flex-lg-row gap-4 align-items-start"
            style={{ width: "100%" }}
          >
            {/* 左側說明 */}
            <div
              className="bg-white rounded-4 shadow-sm p-4"
              style={{ flex: "1 1 320px", minWidth: "0" }}
            >
              <img
                src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80"
                alt="甜點蛋糕"
                className="w-100 rounded-4 mb-4"
                style={{
                  display: "block",
                  width: "100%",
                  height: "220px",
                  objectFit: "cover",
                }}
              />

              <p className="text-secondary lh-lg mb-3">
                常見問題與注意事項，
                包含訂購流程、配送方式與保存建議，讓你輕鬆選購喜歡的甜點。
              </p>
            </div>

            {/* 右側 FAQ */}
            <div style={{ flex: "2 1 640px", minWidth: "0", width: "100%" }}>
              <div className="d-flex flex-column gap-3">
                {faqs.map((item, index) => {
                  const isOpen = openIndex === index;

                  return (
                    <div
                      key={index}
                      className="bg-white rounded-4 shadow-sm overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(index)}
                        className="w-100 border-0 bg-white text-start p-4 d-flex align-items-center justify-content-between"
                        style={{ cursor: "pointer" }}
                      >
                        <span className="fw-bold pe-3">{item.question}</span>
                        <i
                          className={`fa-solid ${
                            isOpen ? "fa-minus" : "fa-plus"
                          }`}
                        ></i>
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-4">
                          <div className="pt-3 border-top text-secondary lh-lg">
                            {item.answer}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-5 bg-white border-top">
        <div className="container">
          <div className="rounded-4 p-4 p-lg-5 text-center bg-light">
            <h2 className="fw-bold mb-3">還想看看更多甜點嗎？</h2>
            <p className="text-secondary mb-4 lh-lg">
              你可以直接前往產品列表頁，瀏覽目前網站中的蛋糕與甜點展示內容。
            </p>
            <Link to="/product" className="btn btn-dark px-4 py-2">
              立即前往產品列表
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default FAQ;