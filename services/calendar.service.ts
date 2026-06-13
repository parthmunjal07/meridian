import { getTenant } from '@/lib/corsair';

export class CalendarService {
  static async getEvents(userId: string, timeMin?: string, timeMax?: string) {
    const t = await getTenant(userId);
    
    try {
      // Get the access token to fetch the user's calendar list directly from Google API
      // since Corsair's high-level SDK doesn't expose calendarList natively yet.
      const token = await t.googlecalendar.keys.get_access_token();
      const calListRes = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const calListData = await calListRes.json();
      const calendars = calListData.items || [];

      // Filter out holiday calendars to avoid clutter
      const activeCalendars = calendars.filter((c: any) => !c.id.includes('#holiday'));

      const queryParamsBase = {
        singleEvents: true,
        orderBy: 'startTime',
        maxResults: 250,
        ...(timeMin ? { timeMin } : { timeMin: new Date().toISOString() }),
        ...(timeMax ? { timeMax } : {})
      };

      // Fetch events for all active calendars in parallel
      const eventPromises = activeCalendars.map(async (cal: any) => {
        try {
          const res = await t.googlecalendar.api.events.getMany({
            calendarId: cal.id,
            ...queryParamsBase
          }) as any;
          return res.items || res || [];
        } catch (err) {
          console.error(`[CalendarService] Failed to fetch events for calendar ${cal.id}:`, err);
          return [];
        }
      });

      const nestedEvents = await Promise.all(eventPromises);
      const rawEvents = nestedEvents.flat();
      
      return rawEvents.map((e: any) => ({
        id: e.id,
        title: e.summary || '(No Title)',
        start: e.start?.dateTime || e.start?.date || new Date().toISOString(),
        end: e.end?.dateTime || e.end?.date,
        description: e.description || '',
        location: e.location || '',
        status: e.status || 'confirmed',
        attendees: e.attendees || [],
        htmlLink: e.htmlLink || '',
        colorId: e.colorId || null
      }));
    } catch (err: any) {
      console.error("[CalendarService] Failed to fetch events:", err.message);
      return [];
    }
  }

  static async createEvent(userId: string, data: any) {
    const t = await getTenant(userId);
    try {
      const res = await t.googlecalendar.api.events.create({
        calendarId: 'primary',
        sendUpdates: 'all',
        event: {
          summary: data.title,
          description: data.description || '',
          location: data.location || '',
          start: { dateTime: data.start },
          end: { dateTime: data.end },
          attendees: data.attendees?.map((email: string) => ({ email })) || [],
          ...(data.colorId ? { colorId: data.colorId } : {}),
          ...(data.recurrence ? { recurrence: data.recurrence } : {})
        }
      });
      return { success: true, event: res };
    } catch (err: any) {
      console.error("[CalendarService] Failed to create event:", err.message);
      throw new Error(err.message || 'Failed to create event');
    }
  }

  static async updateEvent(userId: string, eventId: string, data: any) {
    const t = await getTenant(userId);
    try {
      const res = await t.googlecalendar.api.events.update({
        calendarId: 'primary',
        id: eventId,
        sendUpdates: 'all',
        event: {
          summary: data.title,
          description: data.description || '',
          location: data.location || '',
          start: { dateTime: data.start },
          end: { dateTime: data.end },
          attendees: data.attendees?.map((email: string) => ({ email })) || [],
          ...(data.colorId ? { colorId: data.colorId } : {}),
          ...(data.recurrence ? { recurrence: data.recurrence } : {})
        }
      });
      return { success: true, event: res };
    } catch (err: any) {
      console.error("[CalendarService] Failed to update event:", err.message);
      throw new Error(err.message || 'Failed to update event');
    }
  }

  static async deleteEvent(userId: string, eventId: string) {
    const t = await getTenant(userId);
    try {
      await t.googlecalendar.api.events.delete({
        calendarId: 'primary',
        id: eventId,
        sendUpdates: 'all'
      });
      return { success: true };
    } catch (err: any) {
      console.error("[CalendarService] Failed to delete event:", err.message);
      throw new Error(err.message || 'Failed to delete event');
    }
  }

  static async checkFreeBusy(userId: string, timeMin: string, timeMax: string, items: string[]) {
    // Note: Corsair's Google Calendar SDK currently only exposes 'events' and 'calendar'.
    // The 'freebusy' endpoint is not yet supported in the SDK types.
    // Stubbing this out to return empty data so the UI doesn't crash.
    return {};
  }
}
