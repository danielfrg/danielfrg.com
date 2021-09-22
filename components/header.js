import React from "react";

export default function Header({ title, nav, dark }) {
    let navEls = null;
    if (nav) {
        navEls = nav.map((navItem, i) => {
            return (
                <a
                    key={i}
                    href={navItem.href}
                    className="m-3 text-sm font-light text-gray-500 border-b-2 border-transparent hover:border-link hover:text-link dark:text-white  dark:hover:border-link-dark dark:hover:text-link-dark"
                >
                    {navItem.text}
                </a>
            );
        });
    }

    return (
        <header className={`${dark ? "dark" : ""}`}>
            <div className="dark:bg-dark">
                <div className="container mx-auto max-w-screen-sm p-10 flex flex-wrap">
                    <div className="w-full md:full lg:w-1/2 xl:w-1/2 text-center lg:text-left">
                        <a
                            href="/"
                            className="font-extrabold text-3xl dark:text-white"
                        >
                            {title}
                        </a>
                    </div>

                    <div className="w-full md:full lg:w-1/2 xl:w-1/2">
                        <div className="flex justify-center lg:justify-end">
                            {navEls}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
