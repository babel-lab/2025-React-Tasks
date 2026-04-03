import { Link } from "react-router-dom";

function About() {
  const features = [
    {
      title: "每日新鮮製作",
      text: "我們堅持每日製作蛋糕與甜點，從食材挑選到烘焙流程都用心把關，讓每一口都保有新鮮與溫度。",
      icon: "fa-solid fa-cake-candles",
    },
    {
      title: "嚴選安心食材",
      text: "選用品質穩定的麵粉、鮮奶油與水果原料，盡量減少過多添加，讓甜點回到單純而美好的風味。",
      icon: "fa-solid fa-wheat-awn",
    },
    {
      title: "適合節慶送禮",
      text: "無論是生日、聚會、節日或感謝心意，都能找到適合的蛋糕與甜點，替重要時刻增添儀式感。",
      icon: "fa-solid fa-gift",
    },
  ];

  const steps = [
    {
      step: "01",
      title: "挑選喜歡的甜點",
      text: "從招牌蛋糕、人氣甜點到季節限定商品，選出最符合心情的一款。",
    },
    {
      step: "02",
      title: "加入購物車並結帳",
      text: "確認商品數量與資訊後，即可快速完成購物流程。",
    },
    {
      step: "03",
      title: "等待甜蜜送達",
      text: "完成訂購後，我們會盡快為你準備，讓甜點在最剛好的時間送到手中。",
    },
  ];

  return (
    <div className="bg-light">
      {/* Hero */}
      <section className="py-5 border-bottom bg-white">
        <div className="container">
          <div
            className="d-flex flex-column flex-lg-row align-items-center gap-4 gap-lg-5"
            style={{ width: "100%" }}
          >
            <div
              className="d-flex flex-column justify-content-center"
              style={{ flex: "1 1 520px", minWidth: "0" }}
            >
              <p className="fw-bold mb-2 text-dark">ABOUT US</p>
              <h1 className="fw-bold mb-3">關於甜在心蛋糕舖</h1>
              <p className="text-secondary mb-4 lh-lg">
                甜在心蛋糕舖相信，甜點不只是味道，更是一種陪伴日常、分享心意的方式。
                我們希望把溫柔、療癒與幸福感，透過每一份蛋糕傳遞到你的生活裡。
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/product" className="btn btn-dark px-4 py-2">
                  前往選購
                </Link>
                <Link to="/faq" className="btn btn-outline-dark px-4 py-2">
                  常見問題
                </Link>
              </div>
            </div>

            <div style={{ flex: "1 1 520px", minWidth: "0", width: "100%" }}>
              <img
                src="https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80"
                alt="蛋糕店甜點主視覺"
                className="w-100 rounded-4 shadow-sm"
                style={{
                  display: "block",
                  width: "100%",
                  height: "360px",
                  objectFit: "cover",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 品牌故事 */}
      <section className="py-5">
        <div className="container">
          <div
            className="d-flex flex-column flex-lg-row align-items-stretch gap-4"
            style={{ width: "100%" }}
          >
            <div
              className="bg-white rounded-4 shadow-sm "
              style={{ flex: "1 1 420px", minWidth: "0" }}
            >
              <img
                src="https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=1200&q=80"
                alt="烘焙甜點情境"
                className="w-100"
                style={{
                  display: "block",
                  width: "100%",
                  height: "260px",
                  objectFit: "cover",
                }}
              />
              <div className="p-4 p-lg-5">
                <p className="fw-bold mb-2 text-dark">品牌故事</p>
                <h2 className="fw-bold mb-3">把簡單的甜，做得剛剛好</h2>
                <p className="text-secondary lh-lg mb-3">
                  我們喜歡那些看似平凡，卻能在忙碌生活中帶來安慰的小時刻。
                  一塊柔軟的蛋糕、一口香甜的奶油、一份替自己準備的小小獎勵，
                  都能讓一天變得更溫柔。
                </p>
                <p className="text-secondary lh-lg mb-0">
                  因此，甜在心蛋糕舖以「溫暖、安心、分享」為核心，
                  希望每一位來到這裡的人，都能找到屬於自己的甜點時光。
                  
                </p>
                <ul className="list-unstyled mb-0 mt-4">
                  <li className="mb-3 d-flex align-items-start gap-2">
                    <i className="fa-solid fa-heart text-dark"></i>
                    <span>讓甜點成為生活裡的小確幸</span>
                  </li>
                  <li className="mb-3 d-flex align-items-start gap-2">
                    <i className="fa-solid fa-heart text-dark"></i>
                    <span>用穩定品質帶來安心感</span>
                  </li>
                  <li className="d-flex align-items-start gap-2">
                    <i className="fa-solid fa-heart text-dark"></i>
                    <span>讓送禮與自用都能感受到誠意</span>
                  </li>
                </ul>
              </div>
            </div>

  
          </div>
        </div>
      </section>

      {/* 特色 */}
<section className="py-5 bg-white border-top border-bottom">
  <div className="container">
    <div className="text-center mb-4">
      <p className="fw-bold mb-2 text-dark">WHY CHOOSE US</p>
      <h2 className="fw-bold">甜在心的三個堅持</h2>
    </div>

    <div
      className="d-flex flex-wrap gap-4 justify-content-center"
      style={{ width: "100%" }}
    >
      {features.map((item, index) => {
        const images = [
          "https://images.unsplash.com/photo-1603532648955-039310d9ed75?auto=format&fit=crop&w=1200&q=80", // 新鮮蛋糕
          "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80", // 食材
          "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dhttps://images.unsplash.com/photo-1512223792601-592a9809eed4?q=80&w=652&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dhttps://images.unsplash.com/photo-1512223792601-592a9809eed4?q=80&w=652&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // 送禮蛋糕
        ];

        return (
          <div
            key={index}
            className="bg-light rounded-4 shadow-sm overflow-hidden"
            style={{
              flex: "1 1 280px",
              maxWidth: "360px",
              minWidth: "0",
            }}
          >
            {/* 圖片 */}
            <img
              src={images[index]}
              alt={item.title}
              className="w-100"
              style={{
                display: "block",
                width: "100%",
                height: "200px",
                objectFit: "cover",
              }}
            />

            {/* 文字 */}
            <div className="p-4 text-center">
              <h3 className="h5 fw-bold mb-3">{item.title}</h3>
              <p className="text-secondary lh-lg mb-0">{item.text}</p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
</section>

      {/* 購物流程 */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-4">
            <p className="fw-bold mb-2 text-dark">SHOPPING GUIDE</p>
            <h2 className="fw-bold">簡單三步驟，享受甜點時光</h2>
          </div>

          <div
            className="d-flex flex-wrap gap-4 justify-content-center"
            style={{ width: "100%" }}
          >
            {steps.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-4 shadow-sm p-4"
                style={{
                  flex: "1 1 280px",
                  maxWidth: "360px",
                  minWidth: "0",
                }}
              >
                <p className="fs-2 fw-bold text-dark mb-2">{item.step}</p>
                <h3 className="h5 fw-bold mb-3">{item.title}</h3>
                <p className="text-secondary lh-lg mb-0">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-5 bg-white border-top">
        <div className="container">
          <div
            className="rounded-4 p-4 p-lg-5 text-center bg-light"
          >
            <h2 className="fw-bold mb-3">今天，也替自己留一點甜</h2>
            <p className="text-secondary mb-4 lh-lg">
              從日常小點到節慶蛋糕，讓甜在心蛋糕舖陪你一起收藏生活中的美好片刻。
            </p>
            <Link to="/product" className="btn btn-dark px-4 py-2">
              立即選購甜點
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;