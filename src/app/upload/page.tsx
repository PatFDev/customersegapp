"use client";
import { Fragment, useState } from "react";
import { Disclosure, Transition } from "@headlessui/react";
import { Bars3Icon, CloudIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

const navigation = [
  { name: "Dashboard", href: "#", current: false },
  { name: "Upload Data", href: "#", current: true },
  { name: "Create Campaign", href: "#", current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function UploadModel() {
  const [file, setFile] = useState(null);
const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    if (file) {
        console.log("Uploading:", (file as File).name);
        // router.push('/path-to-redirect');
    }
};

  return (
    <>
      <div className="min-h-full bg-white">
        <Disclosure as="nav" className="border-b border-gray-200 bg-white">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between">
                  <div className="flex">
                    <div className="flex flex-shrink-0 items-center">
                      <img
                        className="block h-8 w-auto lg:hidden"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                        alt="Your Company"
                      />
                      <img
                        className="hidden h-8 w-auto lg:block"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                        alt="Your Company"
                      />
                    </div>
                    <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                      {navigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            item.current ? "border-indigo-500 text-gray-900" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                            "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium"
                          )}
                          aria-current={item.current ? "page" : undefined}
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                  </div>
                  <div className="-mr-2 flex items-center sm:hidden">
                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="sm:hidden">
                <div className="space-y-1 pt-2 pb-3">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={classNames(
                        item.current ? "bg-indigo-50 border-indigo-500 text-indigo-700" : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800",
                        "block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                      )}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <div className="py-10">
          <header>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold leading-tight text-gray-900">Upload Data</h1>
            </div>
          </header>
          <main>
            <div className="mx-auto max-w-lg px-4 sm:px-6 lg:px-8">
              <form className="space-y-8 divide-y divide-gray-200" onSubmit={handleSubmit}>
                <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                  <div>
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Data File</h3>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500">Select a Data file to upload.</p>
                    </div>

                    <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                      <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                        <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                          Upload file
                        </label>
                        <div className="mt-1 sm:mt-0 sm:col-span-2">
                          <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                              <CloudIcon className="mx-auto h-12 w-12 text-gray-400" />
                              <div className="flex text-sm text-gray-600">
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500">
                                  <span>Upload a file</span>
                                  <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                </label>
                              </div>
                              <p className="text-xs text-gray-500">CSV file sup to 10MB</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-5">
                  <div className="flex justify-end">
                    <button type="submit" className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Upload
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
