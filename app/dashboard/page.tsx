"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchUserOrders } from "@/lib/redux/features/orderSlice";
import { fetchEvents } from "@/lib/redux/features/eventSlice";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {  as CalendarDays,  as CreditCard,  as MapPin,  as Ticket,  as Users } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
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

  // Get upcoming events the user has tickets for
  const upcomingEvents = orders
    .filter(order => order.status === "completed")
    .flatMap(order => 
      order.items.map(ticket => {
        const event = events.find(e => e.event_id === ticket.event_id);
        return event ? { ...event, ticket } : null;
      })
    )
    .filter(Boolean)
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Upcoming Events
            </CardTitle>
            <CardDescription className="text-2xl font-bold">
              {upcomingEvents.length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Events you have tickets for
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
            <CardDescription className="text-2xl font-bold">
              {orders.length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Orders placed
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Spent
            </CardTitle>
            <CardDescription className="text-2xl font-bold">
              ${orders.reduce((sum, order) => sum + order.total_price, 0).toFixed(2)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              On tickets and events
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="orders">My Orders</TabsTrigger>
          {user?.user_type === "organizer" && (
            <TabsTrigger value="manage">Manage Events</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Your Upcoming Events</h2>
            <Button asChild variant="outline">
              <Link href="/events">Browse More Events</Link>
            </Button>
          </div>
          
          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
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
                        <Ticket className="mr-2 h-4 w-4" />
                        <span>Seat: {event.ticket.seat_number}</span>
                      </div>
                    </div>
                    <Button asChild className="w-full mt-4">
                      <Link href={`/events/${event.event_id}`}>View Event</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground mb-4">You don't have any upcoming events.</p>
              <Button asChild>
                <Link href="/events">Browse Events</Link>
              </Button>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="orders">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Orders</h2>
          </div>
          
          {ordersLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="pb-2">
                    <div className="h-5 bg-muted rounded w-1/4 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-1/3"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-full"></div>
                      <div className="h-4 bg-muted rounded w-full"></div>
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.order_id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle>Order #{order.order_id}</CardTitle>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === "completed" 
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" 
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <CardDescription>
                      {format(new Date(order.date), "MMMM d, yyyy")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Tickets</h4>
                        <div className="space-y-2">
                          {order.items.map((ticket) => {
                            const event = events.find(e => e.event_id === ticket.event_id);
                            return (
                              <div key={ticket.ticket_id} className="flex justify-between text-sm">
                                <span>{event?.name || "Event"} - {ticket.type} (Seat: {ticket.seat_number})</span>
                                <span>${ticket.price.toFixed(2)}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="flex justify-between pt-2 border-t">
                        <span className="font-medium">Total</span>
                        <span className="font-medium">${order.total_price.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
              <Button asChild>
                <Link href="/events">Browse Events</Link>
              </Button>
            </Card>
          )}
        </TabsContent>
        
        {user?.user_type === "organizer" && (
          <TabsContent value="manage">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Manage Your Events</h2>
              <Button asChild>
                <Link href="/events/create">Create New Event</Link>
              </Button>
            </div>
            
            <Card className="p-6 text-center">
              <p className="text-muted-foreground mb-4">Event management features coming soon.</p>
              <Button asChild>
                <Link href="/events/create">Create Your First Event</Link>
              </Button>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}