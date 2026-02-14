"use client";

import { Badge } from "@/components/ui/badge";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { getCategoryIcon, getCategoryLabel } from "@/lib/data";
import { useUser } from "@clerk/nextjs";
import { format } from "date-fns";
import {
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  Loader2,
  MapPin,
  Share2,
  Ticket,
  Users,
} from "lucide-react";
import { notFound, useRouter, useParams } from "next/navigation";
import React, { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { RegisterModal } from "./_components/register-modal";

// Utility function to darken a color
function darkenColor(color, amount) {
  const colorWithoutHash = color.replace("#", "");
  const num = parseInt(colorWithoutHash, 16);
  const r = Math.max(0, (num >> 16) - amount * 255);
  const g = Math.max(0, ((num >> 8) & 0x00ff) - amount * 255);
  const b = Math.max(0, (num & 0x0000ff) - amount * 255);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

const EventPage = () => {
  const params = useParams();
  const router = useRouter();

  const { user } = useUser();
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const { data: event, isLoading } = useConvexQuery(api.events.getEventBySlug, {
    slug: params.slug,
  });

  const { data: registration } = useConvexQuery(
    api.registrations.checkRegistration,
    event?._id ? { eventId: event._id } : "skip",
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  const isEventFull = event.registrationCount >= event.capacity;
  const isEventPast = event.endDate < Date.now();
  const isOrganizer = user?.id === event.organizerId;

  if (!event) {
    notFound();
  }

  const handleRegister = () => {
    if (!user) {
      toast.error("Please sign in to register");
      return;
    }
    setShowRegisterModal(true);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description.slice(0, 100) + "...",
          url: url,
        });
      } catch (error) {
        // User Cancelled or error occured
        throw new Error("User Cancelled:", error.message);
      }
    } else {
      // Fallback : copy to clipboard
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    }
  };

  return (
    <div
      style={{ backgroundColor: event.themeColor || "#1e3a8a" }}
      className="min-h-screen py-8 -mt-6 md:-mt-16 lg:-mx-5"
    >
      {/* UI */}
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-8">
          <Badge className={"mb-3"} variant={"secondary"}>
            {getCategoryIcon(event.category)}
            {getCategoryLabel(event.category)}
          </Badge>

          <h1 className="texxt-4xl md:text-5xl font-bold mb-4 ">
            {event.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{format(event.startDate, "EEE , MMMM dd , yyyy")}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>
                {format(event.startDate, "h:mm a")} -{" "}
                {format(event.endDate, "h:mm a")}
              </span>
            </div>
          </div>
        </div>

        {/* Hero Image */}

        {event.coverImage && (
          <div className="relative h-62.5 md:h-100 rounded-2xl overflow-hidden mb-6">
            <Image
              src={event.coverImage}
              alt={event.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          {/* Main Content */}

          {/* Description */}
          <div className="space-y-8">
            <Card
              className={"pt-0"}
              style={{
                backgroundColor: event.themeColor
                  ? darkenColor(event.themeColor, 0.04)
                  : "#1e3a8a",
              }}
            >
              <CardContent className={"pt-6"}>
                <h2 className="text-2xl font-bold mb-4">About this event</h2>
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {event.description}
                </p>
              </CardContent>
            </Card>

            {/* Location */}

            <Card
              className={"pt-0"}
              style={{
                backgroundColor: event.themeColor
                  ? darkenColor(event.themeColor, 0.04)
                  : "#1e3a8a",
              }}
            >
              <CardContent className={"pt-6"}>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-pink-500" />
                  Location
                </h2>

                <div className=" space-y-3">
                  <p className="font-medium">
                    {event.city} {event.state || event.country}
                  </p>

                  {event.address && (
                    <p className="text-sm text-muted-foreground">
                      {event.address}
                    </p>
                  )}

                  {event.venue && (
                    <Button className="gap-2" variant="outline">
                      <ExternalLink className="w-4 h-4" />{" "}
                      <a
                        href={event.venue}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        View on Map
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Organiser Info */}
            <Card
              className={"pt-0"}
              style={{
                backgroundColor: event.themeColor
                  ? darkenColor(event.themeColor, 0.04)
                  : "#1e3a8a",
              }}
            >
              <CardContent className={"pt-6"}>
                <h2 className="text-2xl font-bold mb-4">Organizer</h2>
                <div className="flex items-center gap-3">
                  <Avatar className={"w-12 h-12"}>
                    <AvatarImage src="" />
                    <AvatarFallback>
                      {event.organizerName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <p className="font-semibold">{event.organizerName}</p>
                <p className="text-sm text-muted-foreground">Event Organizer</p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Registration Card */}
          <div className="lg:sticky lg:top-24 h-fit">
            <Card
              className={"overflow-hidden py-0"}
              style={{
                backgroundColor: event.themeColor
                  ? darkenColor(event.themeColor, 0.04)
                  : "#1e3a8a",
              }}
            >
              <CardContent className={"p-6 space-y-4"}>
                {/* Price */}
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Price</p>
                  <p className="text-3xl font-bold">
                    {event.ticketType === "free"
                      ? "Free"
                      : `₹${event.ticketPrice}`}
                  </p>
                  {event.ticketType === "paid" && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Pay at event offline
                    </p>
                  )}
                </div>

                <Separator />
                {/* Stats */}

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4 mt-1" />
                      <span className="text-sm mt-1">Attendees</span>
                    </div>
                    <p className="font-semibold mt-1">
                      {event.registrationCount} / {event.capacity}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Date</span>
                    </div>
                    <p className="font-semibold ">
                      {format(event.startDate, "MMM dd")}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Time</span>
                    </div>
                    <p className="font-semibold">
                      {format(event.startDate, "h:mm a")}
                    </p>
                  </div>

                  {/* Regitration Button */}

                  {registration ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-gray-600 bg-green-50 p-3 rounded-lg">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">
                          You&apos;re registered!
                        </span>
                      </div>
                      <Button
                        className={"w-full gap-2"}
                        onClick={() => router.push("/my-tickets")}
                      >
                        <Ticket className="w-4 h-4" />
                        View Ticket
                      </Button>
                    </div>
                  ) : isEventPast ? (
                    <Button disabled className={"w-full"}>
                      Event Ended
                    </Button>
                  ) : isEventFull ? (
                    <Button disabled className="w-full">
                      Event Full
                    </Button>
                  ) : isOrganizer ? (
                    <Button
                      className={"w-full"}
                      onClick={() =>
                        router.push(`/events/${event.slug}/manage`)
                      }
                    >
                      Manage Event
                    </Button>
                  ) : (
                    <Button className="w-full gap-2 " onClick={handleRegister}>
                      <Ticket className="w-4 h-4" />
                      Register for Event
                    </Button>
                  )}

                  {/* Share Button */}

                  <Button
                    className={"w-full gap-2"}
                    variant=" outline"
                    onClick={handleShare}
                  >
                    <Share2 className="w-4 h-4" />
                    Share Event
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Register Modal */}
      {showRegisterModal && (
        <RegisterModal
          event={event}
          isOpen={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
        />
      )}
    </div>
  );
};

export default EventPage;
