import React from "react";

export default function Header({ title, nav }) {
    let navEls = null;
    if (nav) {
        navEls = nav.map((navItem, i) => {
            return (
                <a
                    key={i}
                    href={navItem.href}
                    className="m-3 text-sm font-light text-gray-500 border-b-2 border-white hover:border-link hover:text-link"
                >
                    {navItem.text}
                </a>
            );
        });
    }

    return (
        <header className="container mx-auto max-w-screen-sm p-10">
            <div className="flex flex-wrap">
                <div className="w-full md:full lg:w-1/2 xl:w-1/2 text-center lg:text-left">
                    <a href="/" className="font-extrabold text-3xl">
                        {title}
                    </a>
                </div>

                <div className="w-full md:full lg:w-1/2 xl:w-1/2">
                    <div className="flex justify-center lg:justify-end">
                        {navEls}
                    </div>
                </div>
            </div>
        </header>
    );
}
