"use client";

import React from "react";
import { useLoading } from "../context/LoadingContext";
import Loader from "./Loader";

export default function LoadingLayer() {
  const { loading } = useLoading();
  return loading ? <Loader /> : null;
}
