import { FC } from "react";
import { LuMenu } from 'react-icons/lu'
// import NetworkSwitcher from "./NetworkSwitcher";
import dynamic from "next/dynamic";
export const AppBar: FC = (props) => {
  const menu = [
    {
      name: "Home",
      link: "#home"
    },
    {
      name: "Tools",
      link: "#tools"
    },
    {
      name: "Features",
      link: "#features"
    },
    {
      name: "Price",
      link: "#price"
    },
     {
      name: "Faq",
      link: "#faq"
    }
  ];

  const NetworkSwitcher = dynamic(
  () => import("./NetworkSwitcher").then((mod) => mod.default),
  { ssr: false }
);
  return (
    <div className="">
  <header id="navbar-sticky" className="block overflow-hidden fixed top-0 inset-x-0 z-40 w-full lg:bg-transparent bg-default-950/60 backdrop-blur-2xl transition-all duration-500 shadow-xl lg:shadow-none">
    <div className="container">
      <nav className="flex flex-wrap lg:flex-nowrap items-center justify-between py-4 transition-all duration-500">
        <a href="/" className="inline-block whitespace-nowrap">
          <img src="assets/images/logo1.png" className="h-10" alt="logo" />
        </a>
        <div className="ms-auto flex items-center px-2.5 lg:hidden">
          <button className="hs-collapse-toggle bg-default-100/5 inline-flex h-9 w-12 items-center justify-center rounded-md border border-white/20" type="button" data-hs-collapse="#mobileMenu" data-hs-type="collapse">
           <i data-lucide="menu" className="stroke-white">
            <LuMenu/>
           </i>
          </button>
        </div>
        <div className="hs-collapse mx-auto mt-2 hidden grow basis-full items-center justify-center transition-all duration-300 lg:mt-0 lg:flex lg:basis-auto" id="mobileMenu">
          <ul id="navbar-nav" className="inline-flex flex-col lg:flex-row gap-y-2 gap-x-4 lg:items-center justify-center mt-4 lg:mt-0">
           {
            menu.map((list, index)=> (
              <li className="nav-item" key={index}>
                <a 
                  className="block relative tracking-wide py-1 mx-3.5 text-base capitalize font-semibold cursor-pointer transition-all duration-300 bg-transparent lg:text-white text-default-100 after:transition-all after:duration-500 after:absolute after:-bottom-1 after:h-[2px] after:w-0 after:start-0 after:rounded-full after:bg-transparent hover:text-primary focus:text-primary active:text-primary" 
                  href={list.link}
                >
                  {list.name}
                </a>
              </li>
            ))
           }
          </ul>
        </div>
        <NetworkSwitcher/>
      </nav>
    </div>
  </header>
  {props.children}
</div>
  )
}