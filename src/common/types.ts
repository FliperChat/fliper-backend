import { Document, Types } from 'mongoose';
import { ErrorSeverity, SupportSender } from './enum';

/**
 * Interface for data inside the authorization token.
 *
 * This interface describes the data stored inside the JWT token for a user.
 *
 * @interface ITokenData
 */
export interface ITokenData {
  _id: Types.UUID; // Unique identifier for the user
  email: string; // User's email address
}

/**
 * Interface representing correspondence between the user and support.
 *
 * This interface defines the structure of a message exchanged between a user and support staff.
 *
 * @interface ISupportResponse
 */
export interface ISupportResponse {
  message: string; // The content of the message
  sender: SupportSender; // The sender of the message, either the user or support
  createdAt: Date; // Date and time the message was created
  filesName: string[]; // Array of attached file names (if any)
}

/**
 * Interface for user punishment data.
 *
 * This interface stores details about a user's punishment.
 *
 * @interface IPenalties
 */
export interface IPenalties {
  restriction: string; // For example, "messages", "comments", "articles"
  reason: string; // Reason for punishment
  codeReason: string; // Penalty reason code
  issuedBy: Types.UUID; // Who issued (moderator ID)
  startDate: Date; // Date of commencement of punishment
  endDate: Date | null; // Expiration date (null = indefinite)
}

/**
 * Interface for user warning data.
 *
 * This interface defines the structure of a user's warning data.
 *
 * @interface IWarnings
 */
export interface IWarnings {
  reason: string; // Reason for warning
  codeReason: string; // Warning reason code
  date: Date; // Date of warning
  issuedBy: Types.UUID; // Who issued (moderator ID)
}

/**
 * Interface for error or suspicious activity log data.
 *
 * @interface IErrorLog
 */
export interface IErrorLog extends Document {
  actionType: string; // Type of action (e.g., "suspicious login", "failed payment")
  description: string; // Detailed description of the error or suspicious activity
  userId?: Types.UUID; // Optional reference to the user who triggered the event
  severity: ErrorSeverity; // Severity of the issue
}
