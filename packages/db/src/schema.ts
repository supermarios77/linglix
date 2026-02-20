import { relations } from "drizzle-orm"
import {
  boolean,
  index,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"

export const userRoleEnum = pgEnum("user_role", ["student", "tutor", "admin"])
export const tutorProficiencyEnum = pgEnum("tutor_language_proficiency", [
  "native",
  "fluent",
  "intermediate",
])
export const bookingStatusEnum = pgEnum("booking_status", [
  "pending",
  "confirmed",
  "canceled",
  "completed",
  "no_show",
])
export const applicationStatusEnum = pgEnum("tutor_application_status", [
  "pending",
  "approved",
  "rejected",
])
export const paymentStatusEnum = pgEnum("payment_status", [
  "requires_payment_method",
  "requires_confirmation",
  "requires_action",
  "processing",
  "succeeded",
  "canceled",
])

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    authUserId: text("auth_user_id").notNull().unique(),
    email: text("email").notNull().unique(),
    name: text("name"),
    role: userRoleEnum("role").notNull().default("student"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    roleIdx: index("users_role_idx").on(table.role),
  }),
)

export const tutorProfiles = pgTable(
  "tutor_profiles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" })
      .unique(),
    headline: text("headline"),
    bio: text("bio"),
    hourlyRate: numeric("hourly_rate", { precision: 10, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).notNull(),
    timezone: text("timezone").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    userIdIdx: index("tutor_profiles_user_id_idx").on(table.userId),
  }),
)

export const languages = pgTable("languages", {
  code: varchar("code", { length: 8 }).primaryKey(),
  name: text("name").notNull(),
})

export const tutorLanguages = pgTable(
  "tutor_languages",
  {
    tutorId: uuid("tutor_id")
      .notNull()
      .references(() => tutorProfiles.id, { onDelete: "cascade" }),
    languageCode: varchar("language_code", { length: 8 })
      .notNull()
      .references(() => languages.code, { onDelete: "restrict" }),
    proficiency: tutorProficiencyEnum("proficiency").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.tutorId, table.languageCode] }),
    tutorIdIdx: index("tutor_languages_tutor_id_idx").on(table.tutorId),
    languageCodeIdx: index("tutor_languages_language_code_idx").on(
      table.languageCode,
    ),
  }),
)

export const tutorAvailability = pgTable(
  "tutor_availability",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tutorId: uuid("tutor_id")
      .notNull()
      .references(() => tutorProfiles.id, { onDelete: "cascade" }),
    startAt: timestamp("start_at", { withTimezone: true }).notNull(),
    endAt: timestamp("end_at", { withTimezone: true }).notNull(),
    isBooked: boolean("is_booked").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    tutorStartIdx: index("tutor_availability_tutor_start_idx").on(
      table.tutorId,
      table.startAt,
    ),
  }),
)

export const bookings = pgTable(
  "bookings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tutorId: uuid("tutor_id")
      .notNull()
      .references(() => tutorProfiles.id, { onDelete: "restrict" }),
    studentId: uuid("student_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    availabilityId: uuid("availability_id").references(
      () => tutorAvailability.id,
      { onDelete: "set null" },
    ),
    startAt: timestamp("start_at", { withTimezone: true }).notNull(),
    endAt: timestamp("end_at", { withTimezone: true }).notNull(),
    status: bookingStatusEnum("status").notNull().default("pending"),
    priceAmount: numeric("price_amount", { precision: 10, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    tutorIdIdx: index("bookings_tutor_id_idx").on(table.tutorId),
    studentIdIdx: index("bookings_student_id_idx").on(table.studentId),
    statusIdx: index("bookings_status_idx").on(table.status),
  }),
)

export const lessons = pgTable(
  "lessons",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    bookingId: uuid("booking_id")
      .notNull()
      .references(() => bookings.id, { onDelete: "cascade" })
      .unique(),
    provider: text("provider").notNull().default("stream"),
    roomId: text("room_id").notNull(),
    chatId: text("chat_id"),
    startedAt: timestamp("started_at", { withTimezone: true }),
    endedAt: timestamp("ended_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    bookingIdIdx: index("lessons_booking_id_idx").on(table.bookingId),
  }),
)

export const tutorApplications = pgTable(
  "tutor_applications",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    status: applicationStatusEnum("status").notNull().default("pending"),
    submittedAt: timestamp("submitted_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    reviewerId: uuid("reviewer_id").references(() => users.id, {
      onDelete: "set null",
    }),
    reviewNotes: text("review_notes"),
  },
  (table) => ({
    statusIdx: index("tutor_applications_status_idx").on(table.status),
    userIdIdx: index("tutor_applications_user_id_idx").on(table.userId),
  }),
)

export const payments = pgTable(
  "payments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    bookingId: uuid("booking_id")
      .notNull()
      .references(() => bookings.id, { onDelete: "cascade" }),
    provider: text("provider").notNull(),
    providerReference: text("provider_reference").notNull().unique(),
    status: paymentStatusEnum("status")
      .notNull()
      .default("requires_payment_method"),
    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    bookingIdIdx: index("payments_booking_id_idx").on(table.bookingId),
    statusIdx: index("payments_status_idx").on(table.status),
  }),
)

export const usersRelations = relations(users, ({ one, many }) => ({
  tutorProfile: one(tutorProfiles, {
    fields: [users.id],
    references: [tutorProfiles.userId],
  }),
  bookingsAsStudent: many(bookings),
  applications: many(tutorApplications),
  reviews: many(tutorApplications, { relationName: "reviewer" }),
}))

export const tutorProfilesRelations = relations(
  tutorProfiles,
  ({ one, many }) => ({
    user: one(users, {
      fields: [tutorProfiles.userId],
      references: [users.id],
    }),
    languages: many(tutorLanguages),
    availability: many(tutorAvailability),
    bookings: many(bookings),
  }),
)

export const tutorLanguagesRelations = relations(
  tutorLanguages,
  ({ one }) => ({
    tutor: one(tutorProfiles, {
      fields: [tutorLanguages.tutorId],
      references: [tutorProfiles.id],
    }),
    language: one(languages, {
      fields: [tutorLanguages.languageCode],
      references: [languages.code],
    }),
  }),
)

export const tutorAvailabilityRelations = relations(
  tutorAvailability,
  ({ one, many }) => ({
    tutor: one(tutorProfiles, {
      fields: [tutorAvailability.tutorId],
      references: [tutorProfiles.id],
    }),
    bookings: many(bookings),
  }),
)

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  tutor: one(tutorProfiles, {
    fields: [bookings.tutorId],
    references: [tutorProfiles.id],
  }),
  student: one(users, {
    fields: [bookings.studentId],
    references: [users.id],
  }),
  availability: one(tutorAvailability, {
    fields: [bookings.availabilityId],
    references: [tutorAvailability.id],
  }),
  lesson: one(lessons),
  payments: many(payments),
}))

export const lessonsRelations = relations(lessons, ({ one }) => ({
  booking: one(bookings, {
    fields: [lessons.bookingId],
    references: [bookings.id],
  }),
}))

export const tutorApplicationsRelations = relations(
  tutorApplications,
  ({ one }) => ({
    user: one(users, {
      fields: [tutorApplications.userId],
      references: [users.id],
    }),
    reviewer: one(users, {
      fields: [tutorApplications.reviewerId],
      references: [users.id],
      relationName: "reviewer",
    }),
  }),
)

export const paymentsRelations = relations(payments, ({ one }) => ({
  booking: one(bookings, {
    fields: [payments.bookingId],
    references: [bookings.id],
  }),
}))

export const schema = {
  users,
  tutorProfiles,
  languages,
  tutorLanguages,
  tutorAvailability,
  bookings,
  lessons,
  tutorApplications,
  payments,
}

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type TutorProfile = typeof tutorProfiles.$inferSelect
export type NewTutorProfile = typeof tutorProfiles.$inferInsert
export type Language = typeof languages.$inferSelect
export type NewLanguage = typeof languages.$inferInsert
export type TutorLanguage = typeof tutorLanguages.$inferSelect
export type NewTutorLanguage = typeof tutorLanguages.$inferInsert
export type TutorAvailability = typeof tutorAvailability.$inferSelect
export type NewTutorAvailability = typeof tutorAvailability.$inferInsert
export type Booking = typeof bookings.$inferSelect
export type NewBooking = typeof bookings.$inferInsert
export type Lesson = typeof lessons.$inferSelect
export type NewLesson = typeof lessons.$inferInsert
export type TutorApplication = typeof tutorApplications.$inferSelect
export type NewTutorApplication = typeof tutorApplications.$inferInsert
export type Payment = typeof payments.$inferSelect
export type NewPayment = typeof payments.$inferInsert
