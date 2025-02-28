import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarDays, MapPin, Users } from 'lucide-react'; // Corrected line
import Link from 'next/link';

export default function Home() {
  // Mock data for featured events
  const featuredEvents = [
    {
      id: 1,
      name: 'Tech Conference 2025',
      description: 'Join the biggest tech conference of the year with industry leaders and innovators.',
      date: 'May 15-17, 2025',
      location: 'San Francisco Convention Center',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      ticketsAvailable: 250
    },
    {
      id: 2,
      name: 'Summer Music Festival',
      description: 'Three days of amazing performances from top artists across multiple genres.',
      date: 'July 10-12, 2025',
      location: 'Riverside Park',
      image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      ticketsAvailable: 500
    },
    {
      id: 3,
      name: 'Business Leadership Summit',
      description: 'Learn from successful entrepreneurs and business leaders about the future of work.',
      date: 'September 5-6, 2025',
      location: 'Grand Hotel Conference Center',
      image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      ticketsAvailable: 150
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="relative rounded-xl overflow-hidden mb-16">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
          alt="Event crowd" 
          className="w-full h-[500px] object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-start p-8 md:p-16 z-20">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Find and Book <br />Amazing Events
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-xl">
            Discover concerts, conferences, workshops and more happening in your area. Secure your tickets today!
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" asChild>
              <Link href="/events">Browse Events</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              <Link href="/register">Create Account</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Events</h2>
          <Button variant="outline" asChild>
            <Link href="/events">View All</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden h-full flex flex-col">
              <div className="relative h-48">
                <img 
                  src={event.image} 
                  alt={event.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="flex-1 flex flex-col p-6">
                <h3 className="text-xl font-bold mb-2">{event.name}</h3>
                <p className="text-muted-foreground mb-4 flex-1">{event.description}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="mr-2 h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="mr-2 h-4 w-4" />
                    <span>{event.ticketsAvailable} tickets available</span>
                  </div>
                </div>
                <Button asChild className="w-full">
                  <Link href={`/events/${event.id}`}>View Details</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Find Events</h3>
            <p className="text-muted-foreground">Browse through our curated list of events happening near you.</p>
          </div>
          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Book Tickets</h3>
            <p className="text-muted-foreground">Secure your spot with our easy and secure booking system.</p>
          </div>
          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M5.8 11.3 2 22l10.7-3.79"/><path d="M4 3h.01"/><path d="M22 8h.01"/><path d="M15 2h.01"/><path d="M22 20h.01"/><path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12v0c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"/><path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11v0c-.11.7-.72 1.22-1.43 1.22H17"/><path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98v0C9.52 4.9 9 5.52 9 6.23V7"/><path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z"/></svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Attend & Enjoy</h3>
            <p className="text-muted-foreground">Get your e-tickets instantly and enjoy the experience.</p>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-muted rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Subscribe to our newsletter to get notified about upcoming events and exclusive offers.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <Button>Subscribe</Button>
        </div>
      </section>
    </div>
  );
}