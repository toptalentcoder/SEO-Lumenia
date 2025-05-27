"use client"

import { createContext } from "react";
import type { AppAbility } from "../lib/rbac";

export const AbilityContext = createContext<AppAbility>(undefined as any)