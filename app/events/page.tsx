"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchEvents } from "@/lib/redux/features/eventSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {  as CalendarDays,  as MapPin,  as Search,  as Users } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function EventsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { events, loading } = useSelector((state: RootState) => state.events);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEvents, setFilteredEvents] = useState(events);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  useEffect(() => {
    if (events.length > 0) {
      setFilteredEvents(
        events.filter((event) =>
          event.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [events, searchTerm]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Upcoming Events</h1>
          <p className="text-muted-foreground">
            Discover and book tickets for events happening near you
          </p>
        </div>
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search events..."
            className="pl-10 w-full md:w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden h-full flex flex-col">
              <div className="h-48 bg-muted animate-pulse" />
              <CardContent className="flex-1 flex flex-col p-6 space-y-4">
                <div className="h-6 bg-muted animate-pulse rounded w-3/4" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted animate-pulse rounded w-full" />
                  <div className="h-4 bg-muted animate-pulse rounded w-full" />
                  <div className="h-4 bg-muted animate-pulse rounded w-5/6" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
                  <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                  <div className="h-4 bg-muted animate-pulse rounded w-1/3" />
                </div>
                <div className="h-10 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.event_id} className="overflow-hidden h-full flex flex-col">
              <div className="relative h-48">
                <img 
                  src={event.image_url || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"} 
                  alt={event.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="flex-1 flex flex-col p-6">
                <h3 className="text-xl font-bold mb-2">{event.name}</h3>
                <p className="text-muted-foreground mb-4 flex-1">
                  {event.description.length > 120
                    ? `${event.description.substring(0, 120)}...`
                    : event.description}
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    <span>{format(new Date(event.date), "MMMM d, yyyy")} at {event.time}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="mr-2 h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                </div>
                <Button asChild className="w-full">
                  <Link href={`/events/${event.event_id}`}>View Details</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No events found</h3>
          <p className="text-muted-foreground mb-6">
            We couldn't find any events matching your search criteria.
          </p>
          {searchTerm && (
            <Button onClick={() => setSearchTerm("")}>Clear Search</Button>
          )}
        </div>
      )}
    </div>
  );
}