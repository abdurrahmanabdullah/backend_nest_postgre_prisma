"use client";

import Link from "next/link";
import classes from "./ServerError.module.css";

type ServerErrorProps = {
  errorCode?: string;
  errorTitle?: string;
  errorDesc?: string;
  redirectPath?: string;
};

export function ServerError({
  errorCode = "500",
  errorTitle = "Something bad just happened...",
  errorDesc = "Our servers could not handle your request. Don't worry, our development team was already notified. Try refreshing the page.",
  redirectPath = "/",
}: ServerErrorProps) {
  return <div className={classes.root}>{errorDesc}</div>;
}
