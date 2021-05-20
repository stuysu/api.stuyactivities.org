/*
    THIS FILE IS NOT IMPORTED ANYWHERE INTENTIONALLY

    The GraphQL plugin for intellij and some other editors
    fail to recognize some scalars from packages because
    they're not a part of the user's schema definition

    This is just a file to define those scalars but not import them anywhere
    That way the plugin knows they exist but duplicates aren't being created
 */

import { gql } from 'apollo-server-express';

// All of the following scalars are defined in external packages
gql`
	# Defined in apollo-server-micro
	# Defined in graphql-scalars
	scalar BigInt
	scalar Byte
	scalar Currency
	scalar DateTime
	scalar Date
	scalar Duration
	scalar EmailAddress
	scalar HexColorCode
	scalar Hexadecimal
	scalar HSL
	scalar IPv4
	scalar IPv6
	scalar IBAN
	scalar ISBN
	scalar JSONObject
	scalar JSON
	scalar JWT
	scalar Latitude
	scalar LocalDate
	scalar LocalEndTime
	scalar LocalTime
	scalar Longitude
	scalar MAC
	scalar NegativeFloat
	scalar NegativeInt
	scalar NonEmptyString
	scalar NonNegativeFloat
	scalar NonNegativeInt
	scalar NonPositiveFloat
	scalar NonPositiveInt
	scalar ObjectID
	scalar PhoneNumber
	scalar Port
	scalar PositiveFloat
	scalar PositiveInt
	scalar PostalCode
	scalar RegularExpression
	scalar RGB
	scalar RGBA
	scalar SafeInt
	scalar Time
	scalar Timestamp
	scalar URL
	scalar USCurrency
	scalar UtcOffset
	scalar UUID
	scalar Void
`;
