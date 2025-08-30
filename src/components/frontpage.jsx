// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Autoplay } from 'swiper/modules';
// import 'swiper/css';
// import React from 'react';
function Frontpage() {
  return (
    <>
      <div className="flex justify-center items-center w-full">
        {/* <Swiper
          spaceBetween={50}
          slidesPerView={1}
          className="w-2/3"
          modules={[Autoplay]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
        > */}
        {/* <SwiperSlide> */}
        <div className="flex items-center justify-around gap-5 rounded-xl bg-gray-100 border px-2 border-gray-300 mt-10">
          <div className="">
            <h1 className="">Lord of the Mysteries</h1>
            <p className="size-small place-content-center">
              A captivating tale of intrigue and adventure.
            </p>
            <p className="size-small place-content-center">
              This story follows the journey of a young man who becomes{" "}
            </p>
            <p>embroiled in a world of magic and mystery.</p>
            <button className="border-2 border-gray-300 rounded-md px-2 py-2">
              View More
            </button>
          </div>
          
          <img src="/58826678.jpg" alt="LOTM default cover" className="w-1/4" />
        </div>
        {/* </SwiperSlide>
          <SwiperSlide> */}
        {/* <img src="/1yxy15u.jpg" alt="new cover page for lotm" className="w-full h-auto object-cover" /> */}
        {/* </SwiperSlide>
          <SwiperSlide> */}
        {/* <img src="/1373839.png" alt="new cover page for lotm" className="w-full h-auto object-cover" /> */}
        {/* </SwiperSlide>
          <SwiperSlide> */}
        {/* <img src="/lotm-general-wallpapers-for-phone-and-pc-v0-2g3d8mtu5ade1.webp" alt="new cover page for lotm" className="w-full h-auto object-cover" /> */}
        {/* </SwiperSlide>
          <SwiperSlide> */}
        {/* <img src="/lotm-lament-the-shadow-of-order-has-been-born-through-this-v0-37yznbiw394f1.webp" alt="new cover page for lotm" className="w-full h-auto object-cover" /> */}
        {/* </SwiperSlide>
        </Swiper> */}
      </div>
    </>
  );
}
export default Frontpage;
