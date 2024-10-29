import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Navigation = (props) => {
  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-gray-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <div className="flex items-center">
                  <div>
                    <svg
                      className="h-8 w-8 fill-sky-300"
                      xmlns="http://www.w3.org/2000/svg"
                      width="800"
                      height="800"
                      fill="#000"
                      version="1.1"
                      viewBox="0 0 471.461 471.461"
                      xmlSpace="preserve"
                    >
                      <path d="M235.735 471.456c129.984 0 235.726-105.752 235.726-235.726C471.461 105.757 365.709.005 235.735.005S0 105.747 0 235.73c0 129.984 105.751 235.726 235.735 235.726zm185.417-277.514c-19.662-11.465-14.746 1.635-14.746 1.635l13.109 11.465c13.111 11.466 22.941 16.39 18.025 32.445-4.914 16.057-13.109 1.961-29.49 15.072-16.391 13.109 19.66 16.389 21.295 36.049 1.637 19.662-19.66 9.832-29.49 29.492s-1.635 40.965-6.551 58.99c-4.914 18.025-45.881 42.602-60.76 50.797s-4.781-18.025 0-36.051-11.34-37.686-11.34-70.457-9.83-22.939-39.322-22.939c-29.49 0-42.6-16.391-45.88-47.518-3.28-31.135 24.576-62.261 37.685-72.091C286.798 171 304.824 161.17 322.839 171c18.025 9.831 24.576 19.661 44.236 19.661s19.66-6.55 31.135-14.746c11.465-8.195-16.391-18.025-32.77-16.313-16.381 1.712-13.111-9.897-34.406-18.092-21.297-8.195-29.492 8.195-36.051 11.465-6.551 3.28-29.49 13.11-31.787 0-2.285-13.11 12.117-14.745 26.871-14.745 14.746 0 1.635-11.465-3.279-19.661-4.916-8.195-14.746-8.195-21.85-14.592-7.096-6.397 8.74-18.178 25.119-14.267 16.381 3.911 9.83 15.75 27.855 14.114s0-18.025 0-33.899c0-15.874 19.662-15.262 32.771-21.592 13.109-6.331 29.49 27.635 40.965 41.377 3.797 4.552 9.219 2.534 14.766-2.113 28.984 33.354 48.367 75.228 53.836 121.338-23.426 8.76-21.904-4.962-39.098-14.993zM235.735 9.567c9.046 0 17.949.593 26.718 1.635-3.213 8.941-8.436 15.616-8.436 15.616s-6.549 21.295-21.304 22.94c-14.755 1.645-32.771 0-40.966 13.11s-6.55 36.051-19.66 22.94c-13.11-13.11-1.635-14.114-14.746-27.54-13.11-13.425-16.39-13.425-22.94-13.425-1.932 0-4.122-3.337-5.862-8.214 31.929-17.251 68.429-27.062 107.196-27.062zM98.991 55.735c-.364 2.362 1.711 5.795 11.781 9.993 19.661 8.195 24.193 24.423 15.138 23.782-9.056-.641-45.853 4.379-12.011 14.209 33.851 9.831 31.059 21.353 16.008 26.268-15.052 4.916-11.829-16.361-15.109 4.944-3.28 21.305-6.579 19.67-17.231 22.95-10.653 3.28-30.323 19.67-30.323 31.136 0 11.465-6.56 17.882 6.55 27.712 13.11 9.83-4.103 27.809-10.299 14.708-7.44-15.721-12.642-24.395-20.837-26.039-8.195-1.635-18.752 11.465 0 24.575s19.661 21.305 19.661 31.135 13.569 9.83 23.992 8.195c10.414-1.635 31.805 26.221 39.14 37.686 7.325 11.467 20.435 22.941 38.46 27.855 18.025 4.916 24.576 16.391 14.746 24.576-9.83 8.195-11.465 27.855-22.94 32.771-11.475 4.914-13.11 19.66-19.661 26.221-3.844 3.844-7.573 8.834-10.691 14.602a228.161 228.161 0 01-27.941-18.543c-.268-1.453-.564-2.926-.698-4.254-1.635-16.391-3.28-36.051-13.11-44.236-9.831-8.195-16.39-19.66-19.661-32.771-3.271-13.109 4.915-32.77-1.635-45.881-6.55-13.109-6.55-.822-19.661-19.248-13.11-18.428-13.11-18.438-21.305-33.183-4.379-7.889-7.334-20.463-9.151-33.708 9.093-59.106 41.184-110.724 86.788-145.455z"></path>
                    </svg>
                  </div>
                  <div className="text-sky-300 pl-5 font-bold text-lg">
                    CITY STATS
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    {props.navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        onClick={() => props.changeCurrent(item.name)}
                        aria-current={item.current ? "page" : undefined}
                        className={classNames(
                          item.current
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "rounded-md px-3 py-2 text-sm font-medium"
                        )}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="-mr-2 flex md:hidden">
                {/* Mobile menu button */}
                <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  <Bars3Icon
                    aria-hidden="true"
                    className="block h-6 w-6 group-data-[open]:hidden"
                  />
                  <XMarkIcon
                    aria-hidden="true"
                    className="hidden h-6 w-6 group-data-[open]:block"
                  />
                </DisclosureButton>
              </div>
            </div>
          </div>

          <DisclosurePanel className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
              {props.navigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as="a"
                  href={item.href}
                  onClick={() => props.changeCurrent(item.name)}
                  aria-current={item.current ? "page" : undefined}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                >
                  {item.name}
                </DisclosureButton>
              ))}
            </div>
          </DisclosurePanel>
        </Disclosure>
      </div>
    </>
  );
};

export default Navigation;
