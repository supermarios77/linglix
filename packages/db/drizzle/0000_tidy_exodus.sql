CREATE TYPE "public"."tutor_application_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."booking_status" AS ENUM('pending', 'confirmed', 'canceled', 'completed', 'no_show');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('requires_payment_method', 'requires_confirmation', 'requires_action', 'processing', 'succeeded', 'canceled');--> statement-breakpoint
CREATE TYPE "public"."tutor_language_proficiency" AS ENUM('native', 'fluent', 'intermediate');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('student', 'tutor', 'admin');--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tutor_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"availability_id" uuid,
	"start_at" timestamp with time zone NOT NULL,
	"end_at" timestamp with time zone NOT NULL,
	"status" "booking_status" DEFAULT 'pending' NOT NULL,
	"price_amount" numeric(10, 2) NOT NULL,
	"currency" varchar(3) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "languages" (
	"code" varchar(8) PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lessons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_id" uuid NOT NULL,
	"provider" text DEFAULT 'stream' NOT NULL,
	"room_id" text NOT NULL,
	"chat_id" text,
	"started_at" timestamp with time zone,
	"ended_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "lessons_booking_id_unique" UNIQUE("booking_id")
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_id" uuid NOT NULL,
	"provider" text NOT NULL,
	"provider_reference" text NOT NULL,
	"status" "payment_status" DEFAULT 'requires_payment_method' NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"currency" varchar(3) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "payments_provider_reference_unique" UNIQUE("provider_reference")
);
--> statement-breakpoint
CREATE TABLE "tutor_applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"status" "tutor_application_status" DEFAULT 'pending' NOT NULL,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"reviewed_at" timestamp with time zone,
	"reviewer_id" uuid,
	"review_notes" text
);
--> statement-breakpoint
CREATE TABLE "tutor_availability" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tutor_id" uuid NOT NULL,
	"start_at" timestamp with time zone NOT NULL,
	"end_at" timestamp with time zone NOT NULL,
	"is_booked" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tutor_languages" (
	"tutor_id" uuid NOT NULL,
	"language_code" varchar(8) NOT NULL,
	"proficiency" "tutor_language_proficiency" NOT NULL,
	CONSTRAINT "tutor_languages_tutor_id_language_code_pk" PRIMARY KEY("tutor_id","language_code")
);
--> statement-breakpoint
CREATE TABLE "tutor_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"headline" text,
	"bio" text,
	"hourly_rate" numeric(10, 2) NOT NULL,
	"currency" varchar(3) NOT NULL,
	"timezone" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "tutor_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"auth_user_id" text NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"role" "user_role" DEFAULT 'student' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "users_auth_user_id_unique" UNIQUE("auth_user_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_tutor_id_tutor_profiles_id_fk" FOREIGN KEY ("tutor_id") REFERENCES "public"."tutor_profiles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_availability_id_tutor_availability_id_fk" FOREIGN KEY ("availability_id") REFERENCES "public"."tutor_availability"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tutor_applications" ADD CONSTRAINT "tutor_applications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tutor_applications" ADD CONSTRAINT "tutor_applications_reviewer_id_users_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tutor_availability" ADD CONSTRAINT "tutor_availability_tutor_id_tutor_profiles_id_fk" FOREIGN KEY ("tutor_id") REFERENCES "public"."tutor_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tutor_languages" ADD CONSTRAINT "tutor_languages_tutor_id_tutor_profiles_id_fk" FOREIGN KEY ("tutor_id") REFERENCES "public"."tutor_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tutor_languages" ADD CONSTRAINT "tutor_languages_language_code_languages_code_fk" FOREIGN KEY ("language_code") REFERENCES "public"."languages"("code") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tutor_profiles" ADD CONSTRAINT "tutor_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "bookings_tutor_id_idx" ON "bookings" USING btree ("tutor_id");--> statement-breakpoint
CREATE INDEX "bookings_student_id_idx" ON "bookings" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "bookings_status_idx" ON "bookings" USING btree ("status");--> statement-breakpoint
CREATE INDEX "lessons_booking_id_idx" ON "lessons" USING btree ("booking_id");--> statement-breakpoint
CREATE INDEX "payments_booking_id_idx" ON "payments" USING btree ("booking_id");--> statement-breakpoint
CREATE INDEX "payments_status_idx" ON "payments" USING btree ("status");--> statement-breakpoint
CREATE INDEX "tutor_applications_status_idx" ON "tutor_applications" USING btree ("status");--> statement-breakpoint
CREATE INDEX "tutor_applications_user_id_idx" ON "tutor_applications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "tutor_availability_tutor_start_idx" ON "tutor_availability" USING btree ("tutor_id","start_at");--> statement-breakpoint
CREATE INDEX "tutor_languages_tutor_id_idx" ON "tutor_languages" USING btree ("tutor_id");--> statement-breakpoint
CREATE INDEX "tutor_languages_language_code_idx" ON "tutor_languages" USING btree ("language_code");--> statement-breakpoint
CREATE INDEX "tutor_profiles_user_id_idx" ON "tutor_profiles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "users_role_idx" ON "users" USING btree ("role");