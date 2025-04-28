'use client';

import Image from 'next/image';
import Link from 'next/link';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const logos = [
  { url: 'https://www.eskimoz.fr/', img: '/images/welcome/clientLogo/eskimoz.jpg', alt: 'eskimoz' },
  { url: 'https://www.lesfurets.com/', img: '/images/welcome/clientLogo/lesfurets.jpg', alt: 'les furets' },
  { url: 'https://solutions.lesechos.fr/', img: '/images/welcome/clientLogo/lesechossolutions.jpg', alt: 'les echos solutions' },
  { url: 'https://www.superprof.fr/', img: '/images/welcome/clientLogo/superprof.jpg', alt: 'superprof' },
  { url: 'https://www.castorama.fr/', img: '/images/welcome/clientLogo/castorama.jpg', alt: 'castorama' },
  { url: 'https://www.hellowork.com', img: '/images/welcome/clientLogo/hellowork.jpg', alt: 'hellowork' },
  { url: 'https://www.solocal.com/', img: '/images/welcome/clientLogo/solocal.jpg', alt: 'solocal' },
];

export default function LogoCarousel() {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    speed: 15000,
    autoplaySpeed: 0,
    cssEase: 'linear',
    pauseOnHover: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
        }
      }
    ]
  };

  return (
    <div className="w-full overflow-hidden bg-white">
      <Slider {...settings}>
        {logos.map((logo, index) => (
          <div key={index} className="px-2">
            <Link href={logo.url} target="_blank" rel="noopener noreferrer">
              <Image
                src={logo.img}
                alt={logo.alt}
                width={197}
                height={80}
                className="hover:opacity-80 transition-opacity"
              />
            </Link>
          </div>
        ))}
      </Slider>
    </div>
  );
} 