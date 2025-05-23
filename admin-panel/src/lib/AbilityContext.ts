"use client"

import { createContext } from "react";
import type { AppAbility } from "./rbac";

export const AbilityContext = createContext<AppAbility>(undefined as any)