import React, { FC, useEffect } from "react";
import { useForm, ValidationError } from "@formspree/react";
import { AiOutlineClose } from "react-icons/ai";
import { notify } from "utils/notifications";
import Branding from "components/Branding";

interface ContactViewProps {
  setOpenContact: (open: boolean) => void;
}

export const ContactView: FC<ContactViewProps> = ({ setOpenContact }) => {
  const [state, handleSubmit] = useForm("xpqpaojw");

  // FIX 1: Use useEffect to handle closing after success
  useEffect(() => {
    if (state.succeeded) {
      notify({
        type: "success",
        message: "Thanks for submitting your message, we will get back to you",
      });
      // Delay closing slightly to allow the notification to show
      const timer = setTimeout(() => {
        setOpenContact?.(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.succeeded, setOpenContact]);

  return (
    <section className="flex w-full min-h-screen items-center py-6 px-0 lg:p-10">
      <div className="container">
        <div className="relative w-full rounded-2xl bg-default-950/40 backdrop-blur-2xl px-6 lg:px-10 my-6">
          <div className="grid gap-10 lg:grid-cols-2">
            <Branding
              image="auth-img"
              title="To Build your Solana token creator"
              message="Try and create your first ever Solana project, and if you want to master blockchain development then check the course"
            />

            <div className="lg:ps-0 flex h-full flex-col p-10 text-center">
              <div className="pb-10">
                <a className="flex">
                  <img src="assets/images/logo1.png" className="h-10" alt="logo" />
                </a>
              </div>

              <h4 className="mb-4 text-2xl font-bold text-white">
                Send Emails to us for more details
              </h4>
              <p className="text-default-300 mx-auto mb-5 max-w-sm">
                Send your message so we can provide you more details
              </p>

              <div className="text-start">
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="email" className="text-base/normal text-default-200 mb-2 block font-semibold">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="border-default-200 block w-full rounded border-white/40 bg-transparent py-1.5 px-3 text-white/80 focus:border-white/25 focus:ring-transparent"
                      placeholder="email"
                      required
                    />
                    <ValidationError prefix="Email" field="email" errors={state.errors} />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="message" className="text-base/normal text-default-200 mb-2 block font-semibold">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      className="border-default-200 block w-full rounded border-white/40 bg-transparent py-1.5 px-3 text-white/80 focus:border-white/25 focus:ring-transparent"
                      placeholder="Your message"
                      required
                    ></textarea>
                    <ValidationError prefix="Message" field="message" errors={state.errors} />
                  </div>

                  <button
                    type="submit"
                    disabled={state.submitting}
                    className="bg-primary-600/90 hover:bg-primary-600 group mt-5 inline-flex w-full items-center justify-center rounded-lg px-6 py-2 text-white backdrop-blur-2xl transition-all duration-500"
                  >
                    Send Message
                  </button>
                </form>
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => setOpenContact?.(false)}
                  className="group mt-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-2xl transition-all duration-500 hover:bg-blue-600/60"
                >
                  <AiOutlineClose className="text-2xl text-white group-hover:text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};