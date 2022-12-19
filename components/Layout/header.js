import { React, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

import NavLink from "./navLink";
import { userState } from "../../states/auth";

const header = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [isHamburger, setIsHamburger] = useState(true);
  const [windowWidth, setWindowWidth] = useState(null);
  const user = useRecoilValue(userState);
  const setUser = useSetRecoilState(userState);

  globalThis.window?.addEventListener(
    "resize",
    function () {
      setWindowWidth(window.innerWidth);
    },
    true
  );

  windowWidth < 768 === false ? "hidden" : "flex flex-col";

  return (
    <header className="py-2 border-b-2 border-orange-600">
      <div className="flex flex-row justify-between items-center px-12 md:justify-around md:px-0">
        <div className="animate-rotateY border-2 border-orange-600 rounded-full shadow-xl bg-white">
          <div className="border-2 bg-orange-600 rounded-full p-2">
            <a href={`${user.id ? `/user/${user.id}` : "/login"}`}>
              <div className="text-white text-lg w-32 h-1 mb-6 ml-4">
                running-app
              </div>
            </a>
          </div>
        </div>

        <div
          className="w-8 h-8 border-2 border-orange-600 rounded-md flex flex-col justify-center items-center mt-1 md:hidden hover:cursor-pointer"
          onClick={() => setIsHamburger(!isHamburger)}
        >
          <div className="mb-4 pb-2 mt-0.5">
            <div className="w-5 h-1 text-center text-orange-600 pb-2">__</div>
            <div className="w-5 h-1 text-center text-orange-600 pb-2">__</div>
            <div className="w-5 h-1 text-center text-orange-600 pb-2">__</div>
          </div>
        </div>
        {(isHamburger || windowWidth > 768) && (
          <div
            className={`absolute flex flex-col top-14 right-20 bg-gray-800 rounded-md opacity-70 text-white space-y-3 pt-2 px-5 z-50 md:flex-row md:space-x-16 md:space-y-0 md:static md:text-black md:bg-inherit`}
          >
            {user.id ? (
              <>
                <NavLink
                  href={`/user/${user.id}`}
                  tabName="プロフィール"
                  active={activeTab}
                  setActiveTab={setActiveTab}
                />
                <NavLink
                  href="/login"
                  tabName="ログアウト"
                  active={activeTab}
                  setActiveTab={setActiveTab}
                  isLogout={true}
                  setUser={setUser}
                />
              </>
            ) : (
              <>
                <NavLink
                  href="/login"
                  tabName="ログイン"
                  active={activeTab}
                  setActiveTab={setActiveTab}
                />
                <NavLink
                  href="/signup"
                  tabName="サインアップ"
                  active={activeTab}
                  setActiveTab={setActiveTab}
                />
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default header;
