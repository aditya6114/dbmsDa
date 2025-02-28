"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchVenues } from "@/lib/redux/features/eventSlice";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Users } from "lucide-react";
import Link from "next/link";

export default function VenuesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { venues, loading } = useSelector((state: RootState) => state.events);

  useEffect(() => {
    dispatch(fetchVenues());
  }, [dispatch]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Venues</h1>
        <p className="text-muted-foreground"> <boltArtifact id="fix-mappin-icon-continued" title="Fix MapPin icon import in venues page">
  )
}