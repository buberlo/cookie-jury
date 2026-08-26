import { useMemo, useState } from "react";
import ChargeCard from "./ChargeCard.jsx";

const getVerdict = (cookie) => (cookie.status === "cleared" ? "cleared" : cookie.verdict || "pending");
const getStatus = (cookie) => cookie.status || (cookie.charge ? "charged" : "pending");

const getCharge = (cookie) => {
  if (!cookie.charge) return "";
  return typeof cookie.charge === "string" ? cookie.charge : cookie.charge.title || cookie.charge.type || "";
};

export default function EvidenceBoard({ cookies = [], loading = false, onCharge, onPenance, onClear, onRefresh }) {
  const [query, setQuery] = useState("");
  const [verdictFilter, setVerdictFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [chargeFilter, setChargeFilter] = useState("all");

  const chargeTypes = useMemo(
    () => Array.from(new Set(cookies.map(getCharge).filter(Boolean))).sort(),
    [cookies]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return cookies.filter((cookie) => {
      const verdict = getVerdict(cookie);
      const status = getStatus(cookie);
      const charge = getCharge(cookie);

      if (verdictFilter !== "all" && verdict !== verdictFilter) return false;
      if (statusFilter !== "all" && status !== statusFilter) return false;
      if (chargeFilter !== "all" && charge !== chargeFilter) return false;
      if (!q) return true;

      const haystack = [
        cookie.id,