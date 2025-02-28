"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchUserOrders } from "@/lib/redux/features/orderSlice";
import { fetchEvents } from "@/lib/redux/features/eventSlice";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {  as CalendarDays,  as MapPin,  as TicketIcon } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export default function MyTicketsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useSelector((state: RootState) => state.auth);
  const { orders, loading: ordersLoading } = useSelector((state: RootState) => state.orders);
  const { events, loading: eventsLoading } = useSelector((state: RootState) => state.events);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      dispatch(fetchUserOrders(user.id));
      dispatch(fetchEvents());
    }
  }, [dispatch, user]);

  if (authLoading || !isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-pulse space-y-6 w-full max-w-4xl">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  // Get all tickets from completed orders
  const allTickets = orders
    .filter(order => order.status === "completed")
    .flatMap(order => 
      order.items.map(ticket => {
        const event = events.find(e => e.event_id === ticket.event_id);
        return event ? { ...event, ticket } : null;
      })
    )
    .filter(Boolean)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Separate upcoming and past events
  const now = new Date();
  const upcomingTickets = allTickets.filter(event => new Date(event.date) >= now);
  const pastTickets = allTickets.filter(event => new Date(event.date) < now);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Tickets</h1>
        <p className="text-muted-foreground">
          Manage all your event tickets in one place
        </p>
      </div>

      <div className="space-y-10">
        <div>
          <h2 className="text-2xl font-semibold mb-6">Upcoming Events</h2>
          
          {ordersLoading || eventsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden animate-pulse">
                  <div className="h-40 bg-muted"></div>
                  <CardContent className="p-6 space-y-4">
                    <div className="h-5 bg-muted rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-full"></div>
                      <div className="h-4 bg-muted rounded w-2/3"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <div className="h-10 bg-muted rounded w-full"></div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : upcomingTickets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingTickets.map((event) => (
                <Card key={`${event.event_id}-${event.ticket.ticket_id}`} className="overflow-hidden">
                  <div className="relative h-40">
                    <img 
                      src={event.image_url || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"} 
                      alt={event.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                      {event.ticket.type}
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-2">{event.name}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <CalendarDays className="mr-2 h-4 w-4" />
                        <span>{format(new Date(event.date), "MMMM d, yyyy")} at {event.time}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="mr-2 h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <TicketIcon className="mr-2 h-4 w-4" />
                        <span>Seat: {event.ticket.seat_number}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <Button asChild className="w-full">
                      <Link href={`/events/${event.event_id}`}>View Event</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground mb-4">You don't have any upcoming event tickets.</p>
              <Button asChild>
                <Link href="/events">Browse Events</Link>
              </Button>
            </Card>
          )}
        </div>

        {pastTickets.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Past Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastTickets.map((event) => (
                <Card key={`${event.event_id}-${event.ticket.ticket_id}`} className="overflow-hidden opacity-70">
                  <div className="relative h-40">
                    <img 
                      src={event.image_url || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"} 
                      alt={event.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-muted text-muted-foreground px-2 py-1 rounded text-xs font-medium">
                      {event.ticket.type}
                    </div>
                    <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                      <span className="px-3 py-1 bg-background/80 rounded-full text-sm font-medium">Past Event</span>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-2">{event.name}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <CalendarDays className="mr-2 h-4 w-4" />
                        <span>{format(new Date(event.date), "MMMM d, yyyy")} at {event.time}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="mr-2 h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <TicketIcon className="mr-2 h-4 w-4" />
                        <span>Seat: {event.ticket.seat_number}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}