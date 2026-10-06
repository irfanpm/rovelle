"use client";
import { useEffect } from "react";
import { useCartStore } from "@/modules/cart/store/useCartStore";
export function CartHydration(){useEffect(()=>{void useCartStore.persist.rehydrate();},[]);return null;}
