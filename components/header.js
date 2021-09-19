import React from "react";
import Link from "next/link";

export default function Header({ title, nav }) {
    let navEls = null;
    if (nav) {
        navEls = nav.map((navItem, i) => {
            return (
                <Link key={i} href={navItem.href} passHref={true}>
                    <a className="m-3 text-sm font-light text-gray-500 border-b-2 border-white hover:border-link hover:text-link">
                        {navItem.text}
                    </a>
                </Link>
            );
        });
    }

    return (
        <header className="container mx-auto max-w-screen-sm p-10">
            <div className="flex flex-wrap">
                <div className="w-full md:full lg:w-1/2 xl:w-1/2 text-center lg:text-left">
                    <Link href="/">
                        <a className="font-extrabold text-3xl">{title}</a>
                    </Link>
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
