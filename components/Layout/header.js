import { React, useState } from "react";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";

import NavLink from "./navLink";
import { userState } from "../../states/auth";
import { activeRouteState } from "../../states/route";

const header = () => {
  const [user, setUser] = useRecoilState(userState);
  const [activeTab, setActiveTab] = useRecoilState(
    activeRouteState ?? "ログイン"
  );
  const [isHamburger, setIsHamburger] = useState(window.innerWidth < 768);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  globalThis.window?.addEventListener(
    "resize",
    function () {
      setWindowWidth(window.innerWidth);
    },
    true
  );
  const isShowHamburger = isHamburger && windowWidth < 768;

  return (
    <header className="py-2 border-b-2 border-gray-700">
      <div className="flex flex-row justify-between items-center px-12 md:justify-around md:px-0">
        <div className="animate-rotateY border-2 border-gray-700 rounded-full shadow-xl bg-white">
          <div className="border-2 bg-gray-700 rounded-full p-2">
            <a href={`${user.id ? `/users/${user.id}` : "/login"}`}>
              <div className="text-white text-lg w-32 h-1 mb-6 ml-4">
                running-app
              </div>
            </a>
          </div>
        </div>

        <div
          className="w-8 h-8 border-2 border-gray-700 rounded-md flex flex-col justify-center items-center mt-1 md:hidden hover:cursor-pointer"
          onClick={() => setIsHamburger(!isHamburger)}
        >
          <div className="mb-4 pb-2 mt-0.5">
            <div className="w-5 h-1 text-center text-gray-600 pb-2">__</div>
            <div className="w-5 h-1 text-center text-gray-600 pb-2">__</div>
            <div className="w-5 h-1 text-center text-gray-600 pb-2">__</div>
          </div>
        </div>
        {(isShowHamburger || windowWidth >= 768) && (
          <div
            className={`absolute flex flex-col top-14 right-20 bg-gray-800 rounded-md opacity-70 space-y-3 pt-2 px-5 z-50 md:flex-row md:space-x-16 md:space-y-0 md:static md:bg-inherit md:opacity-100`}
          >
            {user.id ? (
              <>
                <NavLink
                  href={`/users/${user.id}`}
                  tabName="プロフィール"
                  active={activeTab}
                  setActiveTab={setActiveTab}
                  isShowHamburger={isShowHamburger}
                />
                <NavLink
                  href="/records"
                  tabName="記録一覧"
                  active={activeTab}
                  setActiveTab={setActiveTab}
                  isShowHamburger={isShowHamburger}
                />
                <NavLink
                  href="/login"
                  tabName="ログアウト"
                  active={activeTab}
                  setActiveTab={setActiveTab}
                  isLogout={true}
                  setUser={setUser}
                  isShowHamburger={isShowHamburger}
                />
              </>
            ) : (
              <>
                <NavLink
                  href="/login"
                  tabName="ログイン"
                  active={activeTab}
                  setActiveTab={setActiveTab}
                  isShowHamburger={isShowHamburger}
                />
                <NavLink
                  href="/signup"
                  tabName="サインアップ"
                  active={activeTab}
                  setActiveTab={setActiveTab}
                  isShowHamburger={isShowHamburger}
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
