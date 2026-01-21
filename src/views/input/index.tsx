import React, { FC, ChangeEvent } from "react";

interface InputViewProps {
  placeholder?: string;
  name: string;
  clickhandle?: (e: ChangeEvent<HTMLInputElement>) => void;
  id?: string; // optional id for accessibility
}

export const InputView: FC<InputViewProps> = ({ placeholder, name, clickhandle, id }) => {
  const inputId = id || `input-${name.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="mb-4">
      <label
        htmlFor={inputId}
        className="text-base/normal text-default-200 mb-2 block font-semibold"
      >
        {name}
      </label>
      <input
        type="text"
        id={inputId}
        onChange={clickhandle}
        placeholder={placeholder}
        className="border-default-200 block w-full rounded border-white/10 bg-transparent py-1.5 px-3 text-white/80 focus:border-white/25 focus:ring-transparent"
      />
    </div>
  );
};
