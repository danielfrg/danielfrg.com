import React from "react";

export default function Footer({ title, nav }) {
    const year = new Date().getFullYear();

    let navEls = null;
    if (nav) {
        navEls = nav.map((navItem, i) => {
            return (
                <a
                    key={i}
                    href={navItem.href}
                    className="m-3 text-xs font-light text-gray-500 hover:underline"
                >
                    {navItem.text}
                </a>
            );
        });
    }

    return (
        <footer className="container mx-auto max-w-screen-md p-5">
            <div className="flex flex-wrap">
                <div className="w-full">
                    <div className="flex justify-center">
                        <div className="justify-content-center">
                            <p>{navEls}</p>
                        </div>
                    </div>
                </div>

                <div className="w-full text-center">
                    <p className="m-3 text-xs font-light text-gray-500">
                        {title} &copy; {year}
                    </p>
                </div>
            </div>
        </footer>
    );
}
