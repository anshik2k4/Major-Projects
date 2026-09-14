import { Link } from "react-router-dom";
import { getListingImageUrl } from "../api/listings";

export default function ListingCard({ listing, matchReason }) {
  return (
    <li className="col listing-style">
      <Link
        to={`/listing/${listing._id}`}
        className="text-decoration-none text-reset"
      >
        <div className="card shadow-sm" style={{ width: "15rem" }}>
          <img
            src={getListingImageUrl(listing)}
            className="card-img-top imaging"
            alt={listing.title}
          />
          <div className="card-body">
            {matchReason && (
              <p className="ai-match-reason">{matchReason}</p>
            )}
            <h5 className="card-title fw-bold small">{listing.title}</h5>
            <h3 className="card-title text-muted mb-2">{listing.location}</h3>
            <p>
              <b className="fs-2">₹</b>{" "}
              <b className="fs-3">{listing.price.toLocaleString("en-IN")}</b>
              /night
            </p>
          </div>
        </div>
      </Link>
    </li>
  );
}
