"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { 
  fetchEventById, 
  fetchVenueById,
  fetchSpeakersByEventId 
} from "@/lib/redux/features/eventSlice";
import { fetchTicketsByEventId, addSelectedTicket, removeSelectedTicket } from "@/lib/redux/features/ticketSlice";
import { createOrder } from "@/lib/redux/features/orderSlice";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {  as CalendarDays,  as Clock,  as MapPin,  as Users,  as User,  as CreditCard,  as TicketIcon } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";

export default function EventDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { event, venue, speakers, loading: eventLoading } = useSelector((state: RootState) => state.events);
  const { tickets, selectedTickets, loading: ticketLoading } = useSelector((state: RootState) => state.tickets);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { loading: orderLoading } = useSelector((state: RootState) => state.orders);
  
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    if (id) {
      const eventId = parseInt(id as string);
      dispatch(fetchEventById(eventId));
      dispatch(fetchSpeakersByEventId(eventId));
      dispatch(fetchTicketsByEventId(eventId));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (event?.venue_id) {
      dispatch(fetchVenueById(event.venue_id));
    }
  }, [dispatch, event]);

  const handleTicketSelect = (ticket) => {
    const isSelected = selectedTickets.some(t => t.ticket_id === ticket.ticket_id);
    
    if (isSelected) {
      dispatch(removeSelectedTicket(ticket.ticket_id));
    } else {
      dispatch(addSelectedTicket(ticket));
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to book tickets",
        variant: "destructive",
      });
      router.push("/login");
      return;
    }
    
    if (selectedTickets.length === 0) {
      toast({
        title: "No tickets selected",
        description: "Please select at least one ticket",
        variant: "destructive",
      });
      return;
    }
    
    setCheckoutOpen(true);
  };

  const handlePayment = async () => {
    if (!user) return;
    
    try {
      await dispatch(createOrder({
        userId: user.id,
        tickets: selectedTickets,
        paymentMethod,
      })).unwrap();
      
      setCheckoutOpen(false);
      toast({
        title: "Payment successful",
        description: "Your tickets have been booked successfully",
      });
      router.push("/my-tickets");
    } catch (error) {
      toast({
        title: "Payment failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const totalAmount = selectedTickets.reduce((sum, ticket) => sum + ticket.price, 0);

  if (eventLoading && !event) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-64 bg-muted rounded"></div>
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Event not found</h1>
        <p className="text-muted-foreground mb-6">The event you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <a href="/events">Back to Events</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">{event.name}</h1>
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center text-sm">
                <CalendarDays className="mr-2 h-4 w-4" />
                <span>{format(new Date(event.date), "MMMM d, yyyy")}</span>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="mr-2 h-4 w-4" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center text-sm">
                <MapPin className="mr-2 h-4 w-4" />
                <span>{event.location}</span>
              </div>
            </div>
            <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden mb-6">
              <img 
                src={event.image_url || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"} 
                alt={event.name} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <Tabs defaultValue="details">
            <TabsList className="mb-6">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="venue">Venue</TabsTrigger>
              <TabsTrigger value="speakers">Speakers</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4">
              <h2 className="text-2xl font-semibold mb-2">About This Event</h2>
              <div className="prose max-w-none">
                <p>{event.description}</p>
              </div>
            </TabsContent>
            
            <TabsContent value="venue">
              {venue ? (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold mb-2">{venue.name}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-muted-foreground mb-4">
                        {venue.address}, {venue.city}, {venue.state} {venue.zipcode}
                      </p>
                      <div className="flex items-center text-sm mb-2">
                        <Users className="mr-2 h-4 w-4" />
                        <span>Capacity: {venue.capacity} people</span>
                      </div>
                    </div>
                    <div className="h-[200px] bg-muted rounded-lg">
                      {/* Map placeholder */}
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <MapPin className="mr-2 h-6 w-6" />
                        <span>Map view</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Venue information not available</p>
              )}
            </TabsContent>
            
            <TabsContent value="speakers">
              {speakers && speakers.length > 0 ? (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold mb-4">Event Speakers</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {speakers.map((speaker) => (
                      <Card key={speaker.speaker_id}>
                        <CardHeader className="flex flex-row items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle>{speaker.name}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">{speaker.bio}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No speakers listed for this event</p>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Tickets</CardTitle>
              <CardDescription>Select tickets to attend this event</CardDescription>
            </CardHeader>
            <CardContent>
              {ticketLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 border rounded-lg animate-pulse">
                      <div className="h-5 bg-muted rounded w-1/3 mb-2"></div>
                      <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
                      <div className="flex justify-between items-center">
                        <div className="h-6 bg-muted rounded w-1/4"></div>
                        <div className="h-9 bg-muted rounded w-1/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : tickets && tickets.length > 0 ? (
                <div className="space-y-4">
                  {tickets.map((ticket) => {
                    const isSelected = selectedTickets.some(t => t.ticket_id === ticket.ticket_id);
                    return (
                      <div 
                        key={ticket.ticket_id} 
                        className={`p-4 border rounded-lg transition-colors ${
                          isSelected ? 'border-primary bg-primary/5' : ''
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium">{ticket.type}</h3>
                            <p className="text-sm text-muted-foreground">Seat: {ticket.seat_number}</p>
                          </div>
                          <div className="text-lg font-semibold">
                            ${ticket.price.toFixed(2)}
                          </div>
                        </div>
                        <Button 
                          variant={isSelected ? "default" : "outline"} 
                          size="sm" 
                          className="w-full mt-2"
                          onClick={() => handleTicketSelect(ticket)}
                        >
                          {isSelected ? "Selected" : "Select"}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-6">
                  No tickets available for this event
                </p>
              )}

              {selectedTickets.length > 0 && (
                <div className="mt-6 pt-4 border-t">
                  <div className="flex justify-between mb-2">
                    <span>Selected tickets:</span>
                    <span>{selectedTickets.length}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg mb-4">
                    <span>Total:</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                size="lg"
                disabled={selectedTickets.length === 0}
                onClick={handleCheckout}
              >
                {selectedTickets.length > 0 ? "Proceed to Checkout" : "Select Tickets"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Complete Your Purchase</DialogTitle>
            <DialogDescription>
              Review your order and select a payment method.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div>
              <h3 className="font-medium mb-2">Order Summary</h3>
              <div className="space-y-2">
                {selectedTickets.map((ticket) => (
                  <div key={ticket.ticket_id} className="flex justify-between text-sm">
                    <span>{ticket.type} (Seat: {ticket.seat_number})</span>
                    <span>${ticket.price.toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-semibold pt-2 border-t mt-2">
                  <span>Total</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Payment Method</h3>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="credit_card" id="credit_card" />
                  <Label htmlFor="credit_card" className="flex items-center">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Credit Card
                  </Label>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal">PayPal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="apple_pay" id="apple_pay" />
                  <Label htmlFor="apple_pay">Apple Pay</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCheckoutOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePayment} disabled={orderLoading}>
              {orderLoading ? "Processing..." : "Complete Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}